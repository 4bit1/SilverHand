from typing import List, Optional
from pydantic import BaseModel


class CustomerSearchRequest(BaseModel):
    query: str
    location: Optional[str] = None


class CustomerSearchResult(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    primary_skill: Optional[str] = None
    years_of_experience: Optional[int] = None
    location: Optional[str] = None
    skills: List[str] = []
    summary: Optional[str] = None
    match_score: float
    match_reason: str = ""


class CustomerSearchResponse(BaseModel):
    success: bool
    query: str
    detected_service: Optional[str] = None
    required_skills: List[str] = []
    results: List[CustomerSearchResult] = []
    error: Optional[str] = None