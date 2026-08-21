import numpy as np
import torch
import torchaudio
import librosa
from typing import Optional, Dict, Any
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class AudioQualityResult:
    usable: bool
    score: float
    clipping_ratio: float
    snr_db: float
    silence_ratio: float
    noise_suppressed: bool = False
    message: Optional[str] = None
    audio: Optional[np.ndarray] = None
    metadata: Dict[str, Any] = None

class AudioQualityAnalyzer:
    def __init__(
        self,
        sample_rate: int = 16000,
        min_snr_db: float = 5.0,
        max_clipping_ratio: float = 0.15,
        max_silence_ratio: float = 0.8,
        min_score: float = 0.45,
        enable_noise_suppression: bool = True
    ):
        self.sample_rate = sample_rate
        self.min_snr_db = min_snr_db
        self.max_clipping_ratio = max_clipping_ratio
        self.max_silence_ratio = max_silence_ratio
        self.min_score = min_score
        self.enable_noise_suppression = enable_noise_suppression
        self.noise_suppressor = None
        
        if enable_noise_suppression:
            try:
                from df.enhance import init_df
                self.noise_suppressor = init_df(
                    model_base_dir="./models/deepfilternet",
                    post_filter=True
                )
                logger.info("DeepFilterNet initialized for noise suppression")
            except ImportError:
                logger.warning("DeepFilterNet not available, using simple noise gate")
                self.noise_suppressor = None
    
    def normalize_audio(self, audio: np.ndarray, input_sample_rate: int) -> np.ndarray:
        """Normalize audio to target sample rate and mono"""
        if audio.dtype != np.float32:
            audio = audio.astype(np.float32) / 32768.0
        
        if input_sample_rate != self.sample_rate:
            audio = librosa.resample(audio, orig_sr=input_sample_rate, target_sr=self.sample_rate)
        
        # Ensure mono
        if len(audio.shape) > 1:
            audio = np.mean(audio, axis=0)
        
        return audio
    
    def estimate_snr(self, audio: np.ndarray) -> float:
        """Estimate SNR using simple energy-based method"""
        if len(audio) < 1000:
            return 0.0
        
        # Use first 500ms as noise estimate
        noise_frame = audio[:8000]
        signal_frame = audio[8000:]
        
        noise_energy = np.mean(noise_frame ** 2) + 1e-10
        signal_energy = np.mean(signal_frame ** 2) + 1e-10
        
        snr = 10 * np.log10(signal_energy / noise_energy)
        return max(0, snr)
    
    def detect_clipping(self, audio: np.ndarray) -> float:
        """Detect clipping ratio"""
        if len(audio) == 0:
            return 0.0
        
        # Clipping occurs when values are near ±1.0
        clipped = np.sum(np.abs(audio) > 0.95)
        return clipped / len(audio)
    
    def detect_silence(self, audio: np.ndarray, threshold_db: float = -40) -> float:
        """Detect silence ratio"""
        if len(audio) == 0:
            return 1.0
        
        # Convert to dB
        audio_db = 20 * np.log10(np.abs(audio) + 1e-10)
        silence = np.sum(audio_db < threshold_db)
        return silence / len(audio)
    
    def compute_quality_score(self, clipping_ratio: float, snr_db: float, silence_ratio: float) -> float:
        """Compute overall quality score"""
        # Penalize each factor
        clipping_score = 1.0 - min(clipping_ratio / self.max_clipping_ratio, 1.0)
        snr_score = min(snr_db / 20.0, 1.0)  # 20dB SNR gives full score
        silence_score = 1.0 - min(silence_ratio / self.max_silence_ratio, 1.0)
        
        # Weighted average
        score = (0.3 * clipping_score + 0.4 * snr_score + 0.3 * silence_score)
        return score
    
    def suppress_noise(self, audio: np.ndarray) -> np.ndarray:
        """Apply noise suppression"""
        if self.noise_suppressor is None:
            return audio
        
        try:
            # Convert to torch tensor
            audio_tensor = torch.from_numpy(audio).float()
            
            # DeepFilterNet expects specific format
            enhanced = self.noise_suppressor.enhance(audio_tensor)
            
            # Convert back to numpy
            if isinstance(enhanced, torch.Tensor):
                return enhanced.numpy()
            return enhanced
        except Exception as e:
            logger.warning(f"Noise suppression failed: {e}")
            return audio
    
    def analyze(self, audio_data: bytes, sample_rate: int) -> AudioQualityResult:
        """Main analysis entry point"""
        try:
            # Convert bytes to numpy array
            audio = np.frombuffer(audio_data, dtype=np.int16)
            audio = audio.astype(np.float32) / 32768.0
            
            # Normalize
            audio = self.normalize_audio(audio, sample_rate)
            
            # Basic checks
            if len(audio) < 1000:  # Less than 62.5ms
                return AudioQualityResult(
                    usable=False,
                    score=0.0,
                    clipping_ratio=0.0,
                    snr_db=0.0,
                    silence_ratio=1.0,
                    message="Audio too short"
                )
            
            # Detect issues
            clipping_ratio = self.detect_clipping(audio)
            snr_db = self.estimate_snr(audio)
            silence_ratio = self.detect_silence(audio)
            
            # Apply noise suppression if needed
            noise_suppressed = False
            if snr_db < self.min_snr_db and self.enable_noise_suppression:
                audio = self.suppress_noise(audio)
                noise_suppressed = True
                # Re-estimate SNR
                snr_db = self.estimate_snr(audio)
            
            # Compute quality score
            score = self.compute_quality_score(clipping_ratio, snr_db, silence_ratio)
            
            # Determine usability
            usable = (
                score >= self.min_score and
                clipping_ratio <= self.max_clipping_ratio and
                snr_db >= self.min_snr_db and
                silence_ratio <= self.max_silence_ratio
            )
            
            message = None
            if not usable:
                if clipping_ratio > self.max_clipping_ratio:
                    message = "I couldn't hear that clearly. Please try again."
                elif snr_db < self.min_snr_db:
                    message = "There seems to be some background noise. Please try again."
                elif silence_ratio > self.max_silence_ratio:
                    message = "I didn't hear anything. Please speak again."
                else:
                    message = "I couldn't hear that clearly. Please try again."
            
            return AudioQualityResult(
                usable=usable,
                score=score,
                clipping_ratio=clipping_ratio,
                snr_db=snr_db,
                silence_ratio=silence_ratio,
                noise_suppressed=noise_suppressed,
                message=message,
                audio=audio,
                metadata={
                    "duration_ms": len(audio) / self.sample_rate * 1000,
                    "sample_rate": self.sample_rate,
                    "peak_amplitude": float(np.max(np.abs(audio))),
                    "rms_energy": float(np.sqrt(np.mean(audio ** 2)))
                }
            )
            
        except Exception as e:
            logger.error(f"Audio quality analysis failed: {e}")
            return AudioQualityResult(
                usable=False,
                score=0.0,
                clipping_ratio=0.0,
                snr_db=0.0,
                silence_ratio=1.0,
                message="I couldn't process that audio. Please try again."
            )
