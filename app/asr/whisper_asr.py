import torch
import numpy as np
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
import time
import logging

logger = logging.getLogger(__name__)

@dataclass
class ASRResult:
    text: str
    language: str
    language_probability: float
    confidence: float
    alternatives: List[Dict[str, Any]]
    segments: List[Dict[str, Any]]
    duration_ms: int
    processing_time_ms: int
    model_version: str
    critical_facts: Dict[str, Any] = None

class WhisperASR:
    def __init__(
        self,
        model_name: str = "large-v3-turbo",
        device: str = "cuda",
        compute_type: str = "float16",
        cpu_threads: int = 4
    ):
        self.model_name = model_name
        self.device = device
        self.compute_type = compute_type
        self.cpu_threads = cpu_threads
        
        # Load model
        try:
            import whisper
            self.model = whisper.load_model(
                model_name,
                device=device,
                download_root="./models/whisper"
            )
            logger.info(f"Whisper {model_name} loaded on {device}")
        except Exception as e:
            logger.warning(f"Whisper load failed: {e}. Trying faster-whisper")
            try:
                from faster_whisper import WhisperModel
                self.model = WhisperModel(
                    model_name,
                    device=device,
                    compute_type=compute_type,
                    cpu_threads=cpu_threads,
                    download_root="./models/faster-whisper"
                )
                self.use_faster_whisper = True
                logger.info(f"Faster-Whisper {model_name} loaded on {device}")
            except Exception as e2:
                logger.error(f"Failed to load any Whisper model: {e2}")
                raise
    
    def transcribe(
        self,
        audio: np.ndarray,
        language: Optional[str] = None,
        task: str = "transcribe",
        vad_filter: bool = True
    ) -> ASRResult:
        """Transcribe audio"""
        start_time = time.time()
        
        try:
            if hasattr(self, 'use_faster_whisper') and self.use_faster_whisper:
                # Faster-whisper API
                segments, info = self.model.transcribe(
                    audio,
                    language=language,
                    task=task,
                    vad_filter=vad_filter,
                    beam_size=5,
                    best_of=5,
                    temperature=0.0
                )
                
                text = " ".join([seg.text for seg in segments])
                language = info.language
                language_probability = info.language_probability
                confidence = info.avg_logprob
                
                # Build segments list
                segment_list = []
                for seg in segments:
                    segment_list.append({
                        "start": seg.start,
                        "end": seg.end,
                        "text": seg.text,
                        "confidence": seg.avg_logprob
                    })
                
            else:
                # Original whisper API
                result = self.model.transcribe(
                    audio,
                    language=language,
                    task=task,
                    vad_filter=vad_filter,
                    beam_size=5,
                    temperature=0.0
                )
                
                text = result["text"]
                language = result["language"]
                language_probability = result.get("language_probability", 1.0)
                confidence = np.mean([seg.get("confidence", 0.5) for seg in result.get("segments", [])])
                segment_list = result.get("segments", [])
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # Extract critical facts with uncertainty
            critical_facts = self._extract_critical_facts(text, confidence)
            
            return ASRResult(
                text=text.strip(),
                language=language,
                language_probability=float(language_probability),
                confidence=float(confidence),
                alternatives=[],  # Could be populated with beam search results
                segments=segment_list,
                duration_ms=len(audio) / 16000 * 1000,
                processing_time_ms=processing_time,
                model_version=self.model_name,
                critical_facts=critical_facts
            )
            
        except Exception as e:
            logger.error(f"ASR transcription failed: {e}")
            raise
    
    def _extract_critical_facts(self, text: str, confidence: float) -> Dict[str, Any]:
        """Extract critical facts with uncertainty detection"""
        import re
        
        facts = {}
        low_confidence_threshold = 0.85
        
        # Number patterns (years, amounts)
        number_patterns = {
            'experience_years': [
                r'(\d+)\s*(?:years?|yrs?|saal|varusham|varudam)',
                r'(?:about|around|approximately)\s*(\d+)\s*(?:years?|saal)',
                r'(\d+)\s*(?:plus|\+)\s*(?:years?|saal)'
            ],
            'compensation': [
                r'(?:Rs\.?|INR|₹)\s*(\d[\d,]*\d|\d)',
                r'(\d[\d,]*\d)\s*(?:rupees|rs)',
                r'(\d+)\s*(?:lakh|lakhs|lac|lacs)'
            ]
        }
        
        for fact_type, patterns in number_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, text.lower())
                if matches:
                    value = matches[0].replace(',', '')
                    try:
                        numeric_value = int(value)
                        # Flag for confirmation if confidence is low
                        requires_confirmation = confidence < low_confidence_threshold
                        facts[fact_type] = {
                            'raw_span': matches[0],
                            'normalized_value': numeric_value,
                            'confidence': confidence,
                            'requires_confirmation': requires_confirmation
                        }
                    except ValueError:
                        pass
                    break
        
        return facts
