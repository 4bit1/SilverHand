import numpy as np
import torch
from typing import List, Tuple, Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class SpeechSegment:
    start_ms: int
    end_ms: int
    audio: np.ndarray
    confidence: float

class VoiceActivityDetector:
    def __init__(
        self,
        sample_rate: int = 16000,
        threshold: float = 0.4,
        min_speech_duration_ms: int = 250,
        min_silence_duration_ms: int = 1200,
        use_silero: bool = True
    ):
        self.sample_rate = sample_rate
        self.threshold = threshold
        self.min_speech_duration_ms = min_speech_duration_ms
        self.min_silence_duration_ms = min_silence_duration_ms
        self.use_silero = use_silero
        
        if use_silero:
            try:
                torch.hub._validate_not_a_forked_repo = lambda a, b, c: True
                self.model, self.utils = torch.hub.load(
                    repo_or_dir='snakers4/silero-vad',
                    model='silero_vad',
                    force_reload=False,
                    onnx=False
                )
                self.model.eval()
                logger.info("Silero VAD model loaded")
            except Exception as e:
                logger.warning(f"Failed to load Silero VAD: {e}. Using energy-based VAD")
                self.model = None
                self.utils = None
    
    def _energy_based_vad(self, audio: np.ndarray) -> List[SpeechSegment]:
        """Simple energy-based VAD fallback"""
        segments = []
        frame_length = int(0.03 * self.sample_rate)  # 30ms frames
        hop_length = int(0.01 * self.sample_rate)  # 10ms hop
        
        if len(audio) < frame_length:
            return segments
        
        energy = []
        for i in range(0, len(audio) - frame_length, hop_length):
            frame = audio[i:i + frame_length]
            energy.append(np.sqrt(np.mean(frame ** 2)))
        
        if not energy:
            return segments
        
        # Threshold based on energy distribution
        energy = np.array(energy)
        threshold = np.percentile(energy, 20) * 2  # 20th percentile * 2
        threshold = max(threshold, 0.01)
        
        is_speech = energy > threshold
        
        # Smooth
        min_speech_frames = self.min_speech_duration_ms // 10
        min_silence_frames = self.min_silence_duration_ms // 10
        
        # Find speech regions
        speech_regions = []
        start = None
        
        for i, val in enumerate(is_speech):
            if val and start is None:
                start = i
            elif not val and start is not None:
                if i - start >= min_speech_frames:
                    speech_regions.append((start, i))
                start = None
        
        if start is not None and len(is_speech) - start >= min_speech_frames:
            speech_regions.append((start, len(is_speech)))
        
        # Convert to segments
        for start_frame, end_frame in speech_regions:
            start_ms = start_frame * 10
            end_ms = end_frame * 10
            start_sample = int(start_ms / 1000 * self.sample_rate)
            end_sample = int(end_ms / 1000 * self.sample_rate)
            
            segments.append(SpeechSegment(
                start_ms=start_ms,
                end_ms=end_ms,
                audio=audio[start_sample:end_sample],
                confidence=0.5
            ))
        
        return segments
    
    def _silero_vad(self, audio: np.ndarray) -> List[SpeechSegment]:
        """Silero-based VAD"""
        segments = []
        
        # Convert to tensor
        audio_tensor = torch.from_numpy(audio).float()
        
        # Process in chunks
        chunk_size = 512  # 512 samples for 16kHz
        
        speech_probs = []
        with torch.no_grad():
            for i in range(0, len(audio_tensor), chunk_size):
                chunk = audio_tensor[i:i + chunk_size]
                if len(chunk) < chunk_size:
                    chunk = torch.nn.functional.pad(chunk, (0, chunk_size - len(chunk)))
                speech_prob = self.model(chunk, self.sample_rate).item()
                speech_probs.append(speech_prob)
        
        # Convert to frame-based decisions
        is_speech = [prob > self.threshold for prob in speech_probs]
        
        # Smooth with minimum durations
        min_speech_chunks = self.min_speech_duration_ms // (chunk_size * 1000 // self.sample_rate)
        min_silence_chunks = self.min_silence_duration_ms // (chunk_size * 1000 // self.sample_rate)
        
        # Find speech regions
        speech_regions = []
        start = None
        silence_count = 0
        
        for i, val in enumerate(is_speech):
            if val:
                if start is None:
                    start = i
                silence_count = 0
            else:
                if start is not None:
                    silence_count += 1
                    if silence_count >= min_silence_chunks:
                        if i - start - silence_count >= min_speech_chunks:
                            speech_regions.append((start, i - silence_count))
                        start = None
                        silence_count = 0
        
        if start is not None and len(is_speech) - start >= min_speech_chunks:
            speech_regions.append((start, len(is_speech)))
        
        # Convert to segments
        for start_chunk, end_chunk in speech_regions:
            start_ms = start_chunk * chunk_size * 1000 // self.sample_rate
            end_ms = end_chunk * chunk_size * 1000 // self.sample_rate
            start_sample = int(start_ms / 1000 * self.sample_rate)
            end_sample = int(end_ms / 1000 * self.sample_rate)
            
            # Calculate confidence
            conf = np.mean(speech_probs[start_chunk:end_chunk]) if end_chunk > start_chunk else 0
            
            segments.append(SpeechSegment(
                start_ms=start_ms,
                end_ms=end_ms,
                audio=audio[start_sample:end_sample],
                confidence=float(conf)
            ))
        
        return segments
    
    def segment(self, audio: np.ndarray) -> List[SpeechSegment]:
        """Main segmentation method"""
        if self.use_silero and self.model is not None:
            return self._silero_vad(audio)
        else:
            return self._energy_based_vad(audio)
    
    def merge_segments(self, segments: List[SpeechSegment], max_gap_ms: int = 300) -> List[SpeechSegment]:
        """Merge nearby segments"""
        if not segments:
            return []
        
        merged = []
        current = segments[0]
        
        for next_seg in segments[1:]:
            if next_seg.start_ms - current.end_ms <= max_gap_ms:
                # Merge
                current = SpeechSegment(
                    start_ms=current.start_ms,
                    end_ms=max(current.end_ms, next_seg.end_ms),
                    audio=np.concatenate([current.audio, next_seg.audio]),
                    confidence=(current.confidence + next_seg.confidence) / 2
                )
            else:
                merged.append(current)
                current = next_seg
        
        merged.append(current)
        return merged
