from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import base64
import json
from typing import Optional

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: Optional[str] = None
):
    """Transcribe audio file"""
    try:
        # Read audio
        audio_data = await audio_file.read()
        
        # Process audio
        quality_result = audio_quality.analyze(audio_data, 16000)
        if not quality_result.usable:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "poor_audio_quality",
                    "message": quality_result.message
                }
            )
        
        # Transcribe
        result = asr_manager.transcribe(
            quality_result.audio,
            language=language
        )
        
        return {
            "transcript": result.text,
            "language": result.language,
            "confidence": result.confidence,
            "duration_ms": result.duration_ms,
            "processing_time_ms": result.processing_time_ms
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/synthesize")
async def synthesize_speech(
    text: str,
    language: str = "en",
    voice: Optional[str] = None
):
    """Synthesize text to speech"""
    try:
        result = await tts_manager.synthesize(text, language, voice)
        
        return {
            "audio": result["audio"],  # base64 encoded
            "format": result["format"],
            "duration_ms": result["duration_ms"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
