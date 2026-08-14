from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()

class StartInterviewRequest(BaseModel):
    user_id: str
    language: str = "en"

class InterviewMessageRequest(BaseModel):
    session_id: str
    audio_base64: str
    sample_rate: int = 16000

class ConfirmFieldRequest(BaseModel):
    session_id: str
    field: str
    value: Any
    confirmed: bool = True

@router.post("/start")
async def start_interview(request: StartInterviewRequest):
    """Start a new interview session"""
    try:
        result = await orchestrator.start_interview(
            user_id=request.user_id,
            language=request.language
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message")
async def process_message(request: InterviewMessageRequest):
    """Process voice message"""
    try:
        # Decode audio
        audio_data = base64.b64decode(request.audio_base64)
        
        # Process message
        result = await orchestrator.process_message(
            session_id=request.session_id,
            audio_data=audio_data,
            sample_rate=request.sample_rate
        )
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/confirm")
async def confirm_field(request: ConfirmFieldRequest):
    """Confirm or reject a field"""
    try:
        result = await orchestrator.confirm_field(
            session_id=request.session_id,
            field=request.field,
            value=request.value,
            confirmed=request.confirmed
        )
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}")
async def get_session(session_id: str):
    """Get interview session"""
    try:
        session = await session_store.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session.dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
