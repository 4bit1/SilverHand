from typing import List, Optional
from pydantic import BaseModel


class ProviderProfile(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    primary_skill: Optional[str] = None
    years_of_experience: Optional[int] = None
    location: Optional[str] = None
    skills: List[str] = []
    summary: Optional[str] = None


class AdvisorSuggestion(BaseModel):
    roles: List[str] = []
    skills_to_develop: List[str] = []
    industries: List[str] = []
    opportunities: List[str] = []
    explanation: str = ""


class AdvisorResponse(BaseModel):
    success: bool
    user: Optional[ProviderProfile] = None
    similar_profiles: List[ProviderProfile] = []
    suggestions: Optional[AdvisorSuggestion] = None
    error: Optional[str] = None