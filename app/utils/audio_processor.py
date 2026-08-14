import numpy as np
import io
import wave
import subprocess
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

def decode_audio(audio_bytes: bytes, original_filename: str = "recording.webm"):
    """Decode audio with HIGH QUALITY for better transcription"""
    
    # Save to temp file
    temp_input = tempfile.NamedTemporaryFile(suffix='.webm', delete=False)
    temp_input.write(audio_bytes)
    temp_input.close()
    
    temp_output = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
    temp_output.close()
    
    try:
        # HIGH QUALITY ffmpeg conversion
        cmd = [
            'ffmpeg',
            '-i', temp_input.name,
            '-vn',                    # No video
            '-acodec', 'pcm_s16le',   # PCM 16-bit
            '-ar', '16000',           # 16kHz sample rate
            '-ac', '1',               # Mono
            '-af', 'highpass=f=80,lowpass=f=8000,volume=2.0',  # Audio enhancement
            '-y',
            temp_output.name
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"FFmpeg failed: {result.stderr[:500]}")
            return None
        
        # Read WAV
        with wave.open(temp_output.name, 'rb') as wf:
            sample_rate = wf.getframerate()
            n_channels = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)
        
        logger.info(f"WAV: rate={sample_rate}, channels={n_channels}, frames={n_frames}")
        
        # Convert to numpy
        if sampwidth == 2:
            audio_np = np.frombuffer(raw_data, dtype=np.int16)
        else:
            audio_np = np.frombuffer(raw_data, dtype=np.int16)
        
        # Convert to mono
        if n_channels > 1:
            audio_np = audio_np.reshape(-1, n_channels).mean(axis=1)
        
        # Normalize to float32
        audio_np = audio_np.astype(np.float32) / 32768.0
        
        # Check and log audio stats
        duration = len(audio_np) / sample_rate
        rms = float(np.sqrt(np.mean(audio_np ** 2)))
        peak = float(np.max(np.abs(audio_np)))
        
        logger.info(f"Audio stats: duration={duration:.2f}s, RMS={rms:.6f}, peak={peak:.6f}")
        
        # If audio is too quiet, amplify
        if rms < 0.01 and rms > 0:
            gain = min(0.2 / rms, 10.0)  # Max 10x gain
            audio_np = audio_np * gain
            logger.info(f"Amplified by {gain:.2f}x. New RMS: {float(np.sqrt(np.mean(audio_np ** 2))):.6f}")
        
        # Remove DC offset
        audio_np = audio_np - np.mean(audio_np)
        
        return audio_np
        
    except Exception as e:
        logger.error(f"Decode error: {e}")
        return None
    finally:
        try:
            os.unlink(temp_input.name)
            os.unlink(temp_output.name)
        except:
            pass


