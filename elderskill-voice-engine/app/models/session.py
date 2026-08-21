from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class InterviewStage(str, Enum):
    INTRODUCTION = "INTRODUCTION"
    BASIC_INFORMATION = "BASIC_INFORMATION"
    PRIMARY_SKILL = "PRIMARY_SKILL"
    EXPERIENCE = "EXPERIENCE"
    SPECIALIZATION = "SPECIALIZATION"
    CAPABILITIES = "CAPABILITIES"
    WORK_EXAMPLES = "WORK_EXAMPLES"
    TEACHING_OR_MENTORING = "TEACHING_OR_MENTORING"
    LOCATION = "LOCATION"
    AVAILABILITY = "AVAILABILITY"
    WORK_PREFERENCE = "WORK_PREFERENCE"
    COMPENSATION = "COMPENSATION"
    PROFILE_REVIEW = "PROFILE_REVIEW"
    COMPLETED = "COMPLETED"

class ConversationTurn(BaseModel):
    turn_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    speaker: str  # "user" | "assistant"
    text: str
    language: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    audio_duration_ms: Optional[int] = None
    confidence: Optional[float] = None
    profile_updates: List[Dict[str, Any]] = Field(default_factory=list)

class InterviewSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    language: str = "en"
    current_stage: InterviewStage = InterviewStage.INTRODUCTION
    conversation_history: List[ConversationTurn] = Field(default_factory=list)
    profile_state: Dict[str, Any] = Field(default_factory=dict)
    confirmed_facts: Dict[str, Any] = Field(default_factory=dict)
    uncertain_facts: Dict[str, Any] = Field(default_factory=dict)
    missing_information: List[str] = Field(default_factory=list)
    previous_questions: List[str] = Field(default_factory=list)
    previous_answers: List[str] = Field(default_factory=list)
    pending_confirmation: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False
    completed_at: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
