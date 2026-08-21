from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from typing import Optional, List, Dict, Any
import os
from pathlib import Path

class Settings(BaseSettings):
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    # LLM (Qwen)
    LLM_BASE_URL: str = "http://localhost:8000/v1"
    LLM_MODEL: str = "qwen/qwen2.5-72b-instruct"
    LLM_API_KEY: str = ""
    LLM_TIMEOUT: int = 30
    LLM_MAX_RETRIES: int = 2
    
    # ASR
    ASR_MODEL: str = "whisper-large-v3-turbo"
    ASR_DEVICE: str = "cuda"  # cuda | cpu
    ASR_BATCH_SIZE: int = 1
    ASR_LANGUAGE: Optional[str] = None
    ASR_COMPUTE_TYPE: str = "float16"
    ASR_CPU_THREADS: int = 4
    
    # Sarvam ASR (optional)
    SARVAM_API_KEY: str = ""
    SARVAM_ASR_MODEL: str = "saaras:v1"
    
    # TTS
    TTS_PROVIDER: str = "sarvam"  # sarvam | azure | piper
    TTS_VOICE: str = "meera"  # Default voice
    TTS_SPEED: float = 0.95
    TTS_CACHE_ENABLED: bool = True
    TTS_CACHE_SIZE: int = 1000
    
    # Azure TTS
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "centralindia"
    AZURE_TTS_VOICE: str = "en-IN-NeerjaNeural"
    
    # Piper TTS
    PIPER_MODEL_PATH: str = ""
    PIPER_CONFIG_PATH: str = ""
    
    # Audio
    AUDIO_SAMPLE_RATE: int = 16000
    AUDIO_CHANNELS: int = 1
    AUDIO_RETENTION_SECONDS: int = 0
    TEMP_AUDIO_DIR: str = "/tmp/elderskill_audio"
    MAX_AUDIO_DURATION_MS: int = 60000
    
    # VAD
    VAD_THRESHOLD: float = 0.4
    VAD_MIN_SPEECH_DURATION_MS: int = 250
    VAD_MIN_SILENCE_DURATION_MS: int = 1200
    VAD_SAMPLE_RATE: int = 16000
    
    # Noise
    NOISE_SUPPRESSION_ENABLED: bool = True
    NOISE_SUPPRESSION_MODEL: str = "deepfilternet"
    
    # Storage
    DATABASE_URL: str = "sqlite:///./elderskill.db"
    REDIS_URL: str = "redis://localhost:6379"
    PROFILE_STORE_TYPE: str = "sqlite"  # sqlite | redis | postgres
    
    # Security
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Retention
    CONVERSATION_LOG_LEVEL: str = "minimal"  # none | minimal | full
    MAX_HISTORY_TURNS: int = 50
    
    # Evaluation
    EVAL_DATA_PATH: str = "./data/evaluation"
    BENCHMARK_OUTPUT_PATH: str = "./data/benchmarks"
    
    # Model paths
    MODEL_CACHE_DIR: str = "./models"
    WHISPER_MODEL_PATH: str = ""
    FASTRTEXT_MODEL_PATH: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
    
    def ensure_directories(self):
        Path(self.MODEL_CACHE_DIR).mkdir(parents=True, exist_ok=True)
        Path(self.TEMP_AUDIO_DIR).mkdir(parents=True, exist_ok=True)
        Path(self.EVAL_DATA_PATH).mkdir(parents=True, exist_ok=True)
        Path(self.BENCHMARK_OUTPUT_PATH).mkdir(parents=True, exist_ok=True)

settings = Settings()
settings.ensure_directories()
