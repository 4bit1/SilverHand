
import httpx
import numpy as np
import logging
from typing import Optional, Dict, Any
from dataclasses import dataclass
import time
import io
import wave
import json

logger = logging.getLogger(__name__)

@dataclass
class SarvamASRResult:
    text: str
    language: str
    confidence: float
    duration_ms: int
    processing_time_ms: int
    model_version: str

class SarvamASR:
    def __init__(
        self,
        api_key: str,
        model: str = "saaras:v3",
        base_url: str = "https://api.sarvam.ai"
    ):
        self.api_key = api_key
        self.model = model
        self.base_url = base_url
        logger.info(f"Sarvam ASR initialized with model: {model}")
    
    def transcribe(
        self,
        audio: np.ndarray,
        language: Optional[str] = None,
        sample_rate: int = 16000
    ) -> SarvamASRResult:
        """Transcribe audio using Sarvam AI - CORRECTED API FORMAT"""
        start_time = time.time()
        
        try:
            # Convert numpy array to int16
            if audio.dtype != np.int16:
                audio_int16 = (np.clip(audio, -1, 1) * 32768).astype(np.int16)
            else:
                audio_int16 = audio
            
            # Create WAV bytes
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(sample_rate)
                wf.writeframes(audio_int16.tobytes())
            
            wav_bytes = wav_buffer.getvalue()
            logger.info(f"WAV bytes created: {len(wav_bytes)}")
            
            # Sarvam API expects multipart form data with 'file' field
            files = {
                'file': ('audio.wav', wav_bytes, 'audio/wav')
            }
            
            # Language code mapping
            lang_map = {
                'en': 'en-IN',
                'ta': 'ta-IN',
                'hi': 'hi-IN',
                'en-IN': 'en-IN',
                'ta-IN': 'ta-IN',
                'hi-IN': 'hi-IN'
            }
            lang_code = lang_map.get(language, 'en-IN')
            
            data = {
                'model': self.model,
                'language_code': lang_code,
                'with_timestamps': 'false',
                'with_diarization': 'false'
            }
            
            headers = {
                'api-subscription-key': self.api_key,
                'Accept': 'application/json'
            }
            
            logger.info(f"Sarvam request: model={self.model}, lang={lang_code}")
            
            # Make API call with detailed logging
            with httpx.Client(timeout=60) as client:
                response = client.post(
                    f"{self.base_url}/speech-to-text",
                    files=files,
                    data=data,
                    headers=headers
                )
                
                logger.info(f"Sarvam response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"Sarvam response keys: {list(result.keys())}")
                    logger.info(f"Sarvam full response: {json.dumps(result, indent=2)}")
                    
                    # Try different response formats
                    transcript = ""
                    if "transcript" in result:
                        transcript = result["transcript"]
                    elif "text" in result:
                        transcript = result["text"]
                    elif "data" in result and "transcript" in result["data"]:
                        transcript = result["data"]["transcript"]
                    elif "result" in result and "transcript" in result["result"]:
                        transcript = result["result"]["transcript"]
                    
                    detected_language = result.get("language_code", result.get("language", language or "unknown"))
                    confidence = float(result.get("confidence", 0.9))
                    
                    logger.info(f"✅ Sarvam transcript: '{transcript}'")
                    
                    return SarvamASRResult(
                        text=transcript,
                        language=detected_language,
                        confidence=confidence,
                        duration_ms=len(audio) / sample_rate * 1000,
                        processing_time_ms=int((time.time() - start_time) * 1000),
                        model_version=self.model
                    )
                    
                else:
                    error_text = response.text
                    logger.error(f"Sarvam API error {response.status_code}: {error_text[:500]}")
                    raise Exception(f"Sarvam API error: {error_text[:200]}")
                    
        except Exception as e:
            logger.error(f"Sarvam transcription failed: {e}")
            raise

