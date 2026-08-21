# Update the audio processing in main.py

import numpy as np
import base64
import io
import wave
from typing import Optional, Tuple

def decode_base64_audio(audio_base64: str) -> Tuple[np.ndarray, int]:
    """Decode base64 audio to numpy array"""
    try:
        # Decode base64
        audio_bytes = base64.b64decode(audio_base64)
        
        # Try to read as WAV first
        try:
            wav_buffer = io.BytesIO(audio_bytes)
            with wave.open(wav_buffer, 'rb') as wf:
                sample_rate = wf.getframerate()
                n_channels = wf.getnchannels()
                sampwidth = wf.getsampwidth()
                n_frames = wf.getnframes()
                audio_data = wf.readframes(n_frames)
                
                # Convert to numpy
                if sampwidth == 2:
                    audio_np = np.frombuffer(audio_data, dtype=np.int16)
                elif sampwidth == 4:
                    audio_np = np.frombuffer(audio_data, dtype=np.int32)
                else:
                    audio_np = np.frombuffer(audio_data, dtype=np.uint8)
                
                # Convert to mono if stereo
                if n_channels > 1:
                    audio_np = audio_np.reshape(-1, n_channels)
                    audio_np = np.mean(audio_np, axis=1)
                
                # Normalize to float32 [-1, 1]
                if audio_np.dtype == np.int16:
                    audio_np = audio_np.astype(np.float32) / 32768.0
                elif audio_np.dtype == np.int32:
                    audio_np = audio_np.astype(np.float32) / 2147483648.0
                elif audio_np.dtype == np.uint8:
                    audio_np = (audio_np.astype(np.float32) - 128) / 128.0
                
                return audio_np, sample_rate
                
        except Exception:
            # If not WAV, try raw int16
            audio_np = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
            return audio_np, 16000
            
    except Exception as e:
        raise ValueError(f"Failed to decode audio: {e}")

def encode_audio_to_wav(audio_np: np.ndarray, sample_rate: int = 16000) -> bytes:
    """Encode numpy audio array to WAV bytes"""
    try:
        # Convert to int16
        if audio_np.dtype != np.int16:
            audio_int16 = (np.clip(audio_np, -1, 1) * 32768).astype(np.int16)
        else:
            audio_int16 = audio_np
        
        # Create WAV file in memory
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(audio_int16.tobytes())
        
        return wav_buffer.getvalue()
        
    except Exception as e:
        raise ValueError(f"Failed to encode audio: {e}")
