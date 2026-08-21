
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
        start_time = time.time()
        
        try:
            if audio.dtype != np.int16:
                audio_int16 = (np.clip(audio, -1, 1) * 32768).astype(np.int16)
            else:
                audio_int16 = audio
            
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(sample_rate)
                wf.writeframes(audio_int16.tobytes())
            
            wav_bytes = wav_buffer.getvalue()
            
            files = {'file': ('audio.wav', wav_bytes, 'audio/wav')}
            
            lang_map = {
                'en': 'en-IN', 'ta': 'ta-IN', 'hi': 'hi-IN',
                'en-IN': 'en-IN', 'ta-IN': 'ta-IN', 'hi-IN': 'hi-IN'
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
            
            with httpx.Client(timeout=60) as client:
                response = client.post(
                    f"{self.base_url}/speech-to-text",
                    files=files,
                    data=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    result = response.json()
                    transcript = ""
                    if "transcript" in result:
                        transcript = result["transcript"]
                    elif "text" in result:
                        transcript = result["text"]
                    elif "data" in result and "transcript" in result["data"]:
                        transcript = result["data"]["transcript"]
                    
                    detected_language = result.get("language_code", language or "unknown")
                    confidence = float(result.get("confidence", 0.9))
                    
                    logger.info(f"✅ Sarvam: '{transcript}'")
                    
                    return SarvamASRResult(
                        text=transcript,
                        language=detected_language,
                        confidence=confidence,
                        duration_ms=len(audio) / sample_rate * 1000,
                        processing_time_ms=int((time.time() - start_time) * 1000),
                        model_version=self.model
                    )
                else:
                    raise Exception(f"Sarvam error: {response.text[:200]}")
                    
        except Exception as e:
            logger.error(f"Sarvam failed: {e}")
            raise
