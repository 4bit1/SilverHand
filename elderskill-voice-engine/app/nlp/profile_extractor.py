import json
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, ValidationError
from app.llm.qwen_client import QwenClient
from app.models.profile import UserProfile, Skill, FactProvenance
import logging

logger = logging.getLogger(__name__)

class ProfileExtractor:
    def __init__(self, llm_client: QwenClient):
        self.llm_client = llm_client
        self.extraction_schema = {
            "type": "object",
            "properties": {
                "profile_updates": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field": {"type": "string"},
                            "value": {"type": ["string", "number", "array", "object", "null"]},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "requires_confirmation": {"type": "boolean"},
                            "source_text": {"type": "string"}
                        },
                        "required": ["field", "value", "confidence", "requires_confirmation"]
                    }
                },
                "raw_extraction": {"type": "object"}
            },
            "required": ["profile_updates"]
        }
    
    def extract(
        self,
        transcript: str,
        current_profile: UserProfile,
        history: List[Dict[str, Any]],
        language: str = "en"
    ) -> Dict[str, Any]:
        """Extract profile information from transcript"""
        
        prompt = self._build_extraction_prompt(
            transcript=transcript,
            current_profile=current_profile,
            history=history,
            language=language
        )
        
        try:
            # Call LLM for extraction
            response = self.llm_client.chat_completion(
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            # Parse JSON
            extraction = json.loads(response)
            
            # Validate against schema
            validated = self._validate_extraction(extraction)
            
            # Add provenance to each update
            enriched_updates = self._enrich_with_provenance(validated, transcript)
            
            return {
                "profile_updates": enriched_updates,
                "raw_extraction": validated.get("raw_extraction", {})
            }
            
        except Exception as e:
            logger.error(f"Profile extraction failed: {e}")
            return {
                "profile_updates": [],
                "raw_extraction": {},
                "error": str(e)
            }
    
    def _build_extraction_prompt(
        self,
        transcript: str,
        current_profile: UserProfile,
        history: List[Dict[str, Any]],
        language: str
    ) -> str:
        """Build extraction prompt"""
        prompt = f"""
Extract profile information from the user's answer.

User's Answer: "{transcript}"
Language: {language}

Current Profile State:
{json.dumps(current_profile.dict(), indent=2, default=str)}

Recent Conversation History:
{json.dumps(history[-5:], indent=2, default=str)}

Instructions:
1. Extract ONLY information explicitly stated by the user
2. NEVER invent information not in the transcript
3. Map to the following fields:
   - name: Personal name
   - skills[*].name: Skill/profession
   - skills[*].experience_years: Years of experience
   - skills[*].specializations: Specific areas of expertise
   - skills[*].capabilities: Specific abilities
   - work_examples: Examples of work done
   - teaching_experience: Teaching/mentoring experience
   - location.city: City
   - location.state: State
   - availability: Work availability
   - work_preferences: Work type preferences
   - compensation: Expected compensation
   - languages: Languages spoken

4. For each extracted fact, provide:
   - field: JSON path to the field
   - value: The extracted value
   - confidence: 0-1 score of extraction confidence
   - requires_confirmation: true if confidence < 0.85
   - source_text: Exact text from user that supports extraction

5. Return JSON with "profile_updates" array
"""
        return prompt
    
    def _get_system_prompt(self) -> str:
        return """You are an expert at extracting professional profile information from conversational speech.
You extract ONLY what is explicitly stated. You never invent facts. You are precise and conservative.
For older Indian adults speaking about their skills and experience, you understand:
- Indian English expressions
- Code-switching between English/Tamil/Hindi
- Traditional skills and professions
- Informal ways of describing work experience
- Regional terminology for skills and occupations"""
    
    def _validate_extraction(self, extraction: Dict[str, Any]) -> Dict[str, Any]:
        """Validate extraction against schema"""
        validated = {
            "profile_updates": [],
            "raw_extraction": extraction.get("raw_extraction", {})
        }
        
        for update in extraction.get("profile_updates", []):
            try:
                # Basic validation
                field = update.get("field", "")
                value = update.get("value")
                confidence = float(update.get("confidence", 0))
                requires_confirmation = bool(update.get("requires_confirmation", confidence < 0.85))
                source_text = update.get("source_text", "")
                
                # Validate field path
                if not self._is_valid_field_path(field):
                    logger.warning(f"Invalid field path: {field}")
                    continue
                
                # Validate confidence
                confidence = max(0, min(1, confidence))
                
                validated["profile_updates"].append({
                    "field": field,
                    "value": value,
                    "confidence": confidence,
                    "requires_confirmation": requires_confirmation,
                    "source_text": source_text
                })
                
            except Exception as e:
                logger.warning(f"Invalid extraction update: {e}")
                continue
        
        return validated
    
    def _is_valid_field_path(self, field: str) -> bool:
        """Check if field path is valid"""
        valid_paths = [
            "name",
            "skills[*].name",
            "skills[*].experience_years",
            "skills[*].specializations",
            "skills[*].capabilities",
            "work_examples",
            "teaching_experience",
            "location.city",
            "location.state",
            "availability",
            "work_preferences",
            "compensation",
            "languages"
        ]
        
        # Check exact match or pattern match
        for valid_path in valid_paths:
            if field == valid_path:
                return True
            if valid_path.endswith("[*]") and field.startswith(valid_path[:-3]):
                return True
        
        return False
    
    def _enrich_with_provenance(
        self,
        validated: Dict[str, Any],
        transcript: str
    ) -> List[Dict[str, Any]]:
        """Add provenance to each update"""
        enriched = []
        
        for update in validated["profile_updates"]:
            enriched_update = update.copy()
            enriched_update["provenance"] = {
                "source": "voice_interview",
                "transcript_reference": transcript[:200],
                "status": "SELF_REPORTED",
                "timestamp": datetime.utcnow().isoformat()
            }
            enriched.append(enriched_update)
        
        return enriched
