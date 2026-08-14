from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio
import logging

from app.audio.quality_analyzer import AudioQualityAnalyzer
from app.audio.vad import VoiceActivityDetector
from app.asr.manager import ASRManager
from app.language.detector import LanguageDetector
from app.nlp.profile_extractor import ProfileExtractor
from app.nlp.critical_fact_normalizer import CriticalFactNormalizer
from app.llm.qwen_client import QwenClient
from app.tts.manager import TTSManager
from app.storage.profile_store import ProfileStore
from app.storage.session_store import SessionStore
from app.models.session import InterviewSession, InterviewStage, ConversationTurn
from app.models.profile import UserProfile, FactProvenance

logger = logging.getLogger(__name__)

class ConversationOrchestrator:
    def __init__(
        self,
        audio_quality: AudioQualityAnalyzer,
        vad: VoiceActivityDetector,
        asr_manager: ASRManager,
        language_detector: LanguageDetector,
        profile_extractor: ProfileExtractor,
        fact_normalizer: CriticalFactNormalizer,
        llm_client: QwenClient,
        tts_manager: TTSManager,
        profile_store: ProfileStore,
        session_store: SessionStore
    ):
        self.audio_quality = audio_quality
        self.vad = vad
        self.asr_manager = asr_manager
        self.language_detector = language_detector
        self.profile_extractor = profile_extractor
        self.fact_normalizer = fact_normalizer
        self.llm_client = llm_client
        self.tts_manager = tts_manager
        self.profile_store = profile_store
        self.session_store = session_store
        
        self.active_sessions = {}
        self.lock = asyncio.Lock()
    
    async def start_interview(self, user_id: str, language: str = "en") -> Dict[str, Any]:
        """Start a new interview session"""
        session = InterviewSession(
            user_id=user_id,
            language=language,
            current_stage=InterviewStage.INTRODUCTION
        )
        
        # Save session
        await self.session_store.save_session(session)
        self.active_sessions[session.session_id] = session
        
        # Generate introduction
        intro_text = self._get_introduction_text(language)
        intro_audio = await self.tts_manager.synthesize(intro_text, language)
        
        return {
            "session_id": session.session_id,
            "assistant_text": intro_text,
            "audio": intro_audio,
            "next_stage": InterviewStage.BASIC_INFORMATION.value,
            "profile": {},
            "requires_confirmation": False
        }
    
    async def process_message(
        self,
        session_id: str,
        audio_data: bytes,
        sample_rate: int = 16000
    ) -> Dict[str, Any]:
        """Process user voice message"""
        
        # Get session
        session = self.active_sessions.get(session_id)
        if not session:
            session = await self.session_store.get_session(session_id)
            if not session:
                raise ValueError(f"Session {session_id} not found")
            self.active_sessions[session_id] = session
        
        async with self.lock:
            # 1. Audio Quality Analysis
            quality_result = self.audio_quality.analyze(audio_data, sample_rate)
            if not quality_result.usable:
                return await self._handle_poor_audio(quality_result, session)
            
            # 2. VAD
            segments = self.vad.segment(quality_result.audio)
            if not segments:
                return await self._handle_no_speech(session)
            
            # Merge segments
            merged_segments = self.vad.merge_segments(segments)
            full_audio = np.concatenate([seg.audio for seg in merged_segments])
            
            # 3. ASR
            asr_result = self.asr_manager.transcribe(
                full_audio,
                language=session.language
            )
            
            # 4. Language Detection
            lang_result = self.language_detector.detect(asr_result.text)
            
            # Update session language if confidence is high
            if lang_result.language_confidence > 0.8:
                session.language = lang_result.language
            
            # 5. Profile Extraction
            extraction = self.profile_extractor.extract(
                transcript=asr_result.text,
                current_profile=session.profile_state,
                history=[turn.dict() for turn in session.conversation_history],
                language=session.language
            )
            
            # 6. Critical Fact Normalization
            normalized_updates = []
            for update in extraction.get("profile_updates", []):
                normalized = self.fact_normalizer.normalize_fact(
                    field=update["field"],
                    value=update["value"],
                    transcript=asr_result.text,
                    asr_confidence=asr_result.confidence
                )
                update.update(normalized)
                normalized_updates.append(update)
            
            # 7. Apply Profile Updates
            applied_updates = await self._apply_profile_updates(
                session,
                normalized_updates
            )
            
            # 8. Update conversation history
            user_turn = ConversationTurn(
                speaker="user",
                text=asr_result.text,
                language=session.language,
                confidence=asr_result.confidence,
                profile_updates=applied_updates
            )
            session.conversation_history.append(user_turn)
            
            # 9. Generate Next Question
            next_question = await self._generate_next_question(
                session,
                asr_result.text
            )
            
            # 10. TTS
            audio_response = await self.tts_manager.synthesize(
                next_question,
                session.language
            )
            
            # 11. Update session
            assistant_turn = ConversationTurn(
                speaker="assistant",
                text=next_question,
                language=session.language
            )
            session.conversation_history.append(assistant_turn)
            session.updated_at = datetime.utcnow()
            
            # Save session
            await self.session_store.save_session(session)
            
            # Build response
            response = {
                "transcript": asr_result.text,
                "language": session.language,
                "profile_updates": applied_updates,
                "profile": session.profile_state,
                "assistant_text": next_question,
                "audio": audio_response,
                "next_stage": session.current_stage.value,
                "requires_confirmation": any(
                    u.get("requires_confirmation", False) for u in applied_updates
                )
            }
            
            return response
    
    async def _handle_poor_audio(
        self,
        quality_result,
        session: InterviewSession
    ) -> Dict[str, Any]:
        """Handle poor audio quality"""
        message = quality_result.message or "I couldn't hear that clearly. Please try again."
        audio_response = await self.tts_manager.synthesize(message, session.language)
        
        return {
            "transcript": "",
            "language": session.language,
            "profile_updates": [],
            "profile": session.profile_state,
            "assistant_text": message,
            "audio": audio_response,
            "next_stage": session.current_stage.value,
            "requires_confirmation": False,
            "error": "poor_audio_quality"
        }
    
    async def _handle_no_speech(self, session: InterviewSession) -> Dict[str, Any]:
        """Handle no speech detected"""
        message = "I didn't hear anything. Please speak again."
        audio_response = await self.tts_manager.synthesize(message, session.language)
        
        return {
            "transcript": "",
            "language": session.language,
            "profile_updates": [],
            "profile": session.profile_state,
            "assistant_text": message,
            "audio": audio_response,
            "next_stage": session.current_stage.value,
            "requires_confirmation": False,
            "error": "no_speech"
        }
    
    async def _apply_profile_updates(
        self,
        session: InterviewSession,
        updates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Apply profile updates with validation"""
        applied = []
        
        for update in updates:
            # Check if confirmation is required
            if update.get("requires_confirmation", False):
                session.pending_confirmation = update
                applied.append(update)
                continue
            
            # Apply update to profile
            field = update["field"]
            value = update["normalized_value"]
            
            # Apply using field path
            self._set_nested_field(session.profile_state, field, value)
            
            # Add provenance
            provenance = FactProvenance(
                field=field,
                value=value,
                session_id=session.session_id,
                transcript_reference=update.get("source_text", ""),
                status="SELF_REPORTED"
            )
            
            # Store in confirmed facts
            session.confirmed_facts[field] = {
                "value": value,
                "provenance": provenance.dict(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            applied.append(update)
        
        return applied
    
    def _set_nested_field(self, obj: Dict, field: str, value: Any):
        """Set nested field using dot notation"""
        keys = field.replace('[', '.').replace(']', '').split('.')
        current = obj
        
        for key in keys[:-1]:
            if key.isdigit():
                key = int(key)
                while len(current) <= key:
                    current.append({})
                current = current[key]
            else:
                if key not in current:
                    current[key] = {}
                current = current[key]
        
        final_key = keys[-1]
        if final_key.isdigit():
            final_key = int(final_key)
            while len(current) <= final_key:
                current.append(None)
            current[final_key] = value
        else:
            current[final_key] = value
    
    async def _generate_next_question(
        self,
        session: InterviewSession,
        last_answer: str
    ) -> str:
        """Generate next question based on current state"""
        
        # Get missing information
        missing = self._get_missing_information(session)
        
        # Build prompt
        prompt = f"""
Generate ONE natural follow-up question for an older adult in an interview.

Current Profile:
{json.dumps(session.profile_state, indent=2)}

Missing Information:
{missing}

Last Answer: "{last_answer}"

Already Asked: {session.previous_questions}

Rules:
- Ask exactly ONE question
- Don't repeat already answered questions
- Be warm and respectful
- Use simple language
- Match the user's language ({session.language})
- Focus on the most important missing information
"""
        
        try:
            response = await self.llm_client.chat_completion_async(
                messages=[
                    {"role": "system", "content": "You are a warm, patient interviewer for older adults."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=100
            )
            
            question = response.strip()
            session.previous_questions.append(question)
            return question
            
        except Exception as e:
            logger.error(f"Question generation failed: {e}")
            return "Could you tell me more about your work experience?"
    
    def _get_missing_information(self, session: InterviewSession) -> List[str]:
        """Get missing information fields"""
        profile = session.profile_state
        missing = []
        
        if not profile.get("name"):
            missing.append("name")
        if not profile.get("location", {}).get("city"):
            missing.append("location")
        if not profile.get("skills"):
            missing.append("primary_skill")
        else:
            for i, skill in enumerate(profile["skills"]):
                if not skill.get("experience_years"):
                    missing.append(f"experience_years_{i}")
                if not skill.get("specializations"):
                    missing.append(f"specialization_{i}")
        if not profile.get("availability"):
            missing.append("availability")
        if not profile.get("work_preferences"):
            missing.append("work_preferences")
        
        return missing
    
    def _get_introduction_text(self, language: str) -> str:
        """Get introduction text based on language"""
        introductions = {
            "en": "Hello! I'm here to help you create your professional profile. I'll ask you some questions about your work and skills. Let's start. What is your name?",
            "ta": "Vanakkam! Ungal professional profile create panna naan help pannuren. Ungal velai and skills pathi sila kelvigal ketpen. Aarambippom. Ungal per enna?",
            "hi": "Namaste! Main aapka professional profile banane mein madad karne ke liye yahan hoon. Main aapke kaam aur skills ke baare mein kuch sawal puchunga. Shuru karte hain. Aapka naam kya hai?"
        }
        return introductions.get(language, introductions["en"])
