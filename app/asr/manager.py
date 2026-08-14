
from typing import Optional, Dict, Any
import numpy as np
import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ASRResult:
    text: str
    language: str
    confidence: float
    duration_ms: int
    processing_time_ms: int
    model_version: str

class ASRManager:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.models = {}
        self._load_models()
    
    def _load_models(self):
        """Load configured ASR models"""
        # Load Whisper as fallback
        try:
            import whisper
            model_name = self.config.get('whisper_model', 'base')
            self.models['whisper'] = whisper.load_model(model_name, device=self.config.get('device', 'cpu'))
            logger.info(f"Whisper {model_name} loaded")
        except Exception as e:
            logger.warning(f"Failed to load Whisper: {e}")
        
        # Load Sarvam if API key is available
        sarvam_api_key = self.config.get('sarvam_api_key', '')
        if sarvam_api_key:
            try:
                from app.asr.sarvam_asr import SarvamASR
                self.models['sarvam'] = SarvamASR(
                    api_key=sarvam_api_key,
                    model=self.config.get('sarvam_model', 'saaras:v1')
                )
                logger.info("Sarvam ASR loaded")
            except Exception as e:
                logger.warning(f"Failed to load Sarvam: {e}")
    
    def transcribe(
        self,
        audio: np.ndarray,
        language: Optional[str] = None,
        preferred_model: Optional[str] = None
    ) -> ASRResult:
        """Transcribe using appropriate model"""
        
        # Use preferred model if specified and available
        if preferred_model and preferred_model in self.models:
            try:
                result = self.models[preferred_model].transcribe(audio, language)
                return self._convert_result(result, preferred_model)
            except Exception as e:
                logger.warning(f"{preferred_model} transcription failed: {e}")
        
        # For Indian languages, prefer Sarvam
        if language in ['ta', 'hi', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa', 'or']:
            if 'sarvam' in self.models:
                try:
                    result = self.models['sarvam'].transcribe(audio, language)
                    return self._convert_result(result, 'sarvam')
                except Exception as e:
                    logger.warning(f"Sarvam failed for {language}: {e}")
        
        # Fallback to Whisper
        if 'whisper' in self.models:
            try:
                if hasattr(self.models['whisper'], 'transcribe'):
                    result = self.models['whisper'].transcribe(audio, language=language)
                    return ASRResult(
                        text=result["text"],
                        language=result.get("language", language or "unknown"),
                        confidence=0.9,
                        duration_ms=len(audio) / 16000 * 1000,
                        processing_time_ms=0,
                        model_version="whisper"
                    )
            except Exception as e:
                logger.error(f"Whisper failed: {e}")
        
        # If all models fail, return empty result
        raise Exception("No ASR models available")
    
    def _convert_result(self, result, model_name: str) -> ASRResult:
        """Convert various result formats to standard ASRResult"""
        if hasattr(result, 'text'):
            return ASRResult(
                text=result.text,
                language=result.language,
                confidence=result.confidence,
                duration_ms=result.duration_ms,
                processing_time_ms=result.processing_time_ms,
                model_version=model_name
            )
        elif isinstance(result, dict):
            return ASRResult(
                text=result.get("text", ""),
                language=result.get("language", "unknown"),
                confidence=result.get("confidence", 0.9),
                duration_ms=result.get("duration_ms", 0),
                processing_time_ms=result.get("processing_time_ms", 0),
                model_version=model_name
            )
        else:
            return ASRResult(
                text=str(result),
                language="unknown",
                confidence=0.5,
                duration_ms=0,
                processing_time_ms=0,
                model_version=model_name
            )
