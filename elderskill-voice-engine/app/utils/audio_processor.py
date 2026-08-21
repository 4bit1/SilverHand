
import numpy as np
import io
import wave
import subprocess
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

def decode_audio(audio_bytes: bytes, original_filename: str = "recording.webm"):
    temp_input = tempfile.NamedTemporaryFile(suffix='.webm', delete=False)
    temp_input.write(audio_bytes)
    temp_input.close()
    
    temp_output = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
    temp_output.close()
    
    try:
        cmd = [
            'ffmpeg', '-i', temp_input.name,
            '-vn', '-acodec', 'pcm_s16le',
            '-ar', '16000', '-ac', '1',
            '-af', 'highpass=f=80,lowpass=f=8000,volume=2.0',
            '-y', temp_output.name
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"FFmpeg failed: {result.stderr[:500]}")
            return None
        
        with wave.open(temp_output.name, 'rb') as wf:
            sample_rate = wf.getframerate()
            n_channels = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)
        
        audio_np = np.frombuffer(raw_data, dtype=np.int16)
        
        if n_channels > 1:
            audio_np = audio_np.reshape(-1, n_channels).mean(axis=1)
        
        audio_np = audio_np.astype(np.float32) / 32768.0
        
        duration = len(audio_np) / sample_rate
        rms = float(np.sqrt(np.mean(audio_np ** 2)))
        
        logger.info(f"Audio: duration={duration:.2f}s, RMS={rms:.6f}")
        
        if rms < 0.01 and rms > 0:
            gain = min(0.2 / rms, 10.0)
            audio_np = audio_np * gain
        
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
