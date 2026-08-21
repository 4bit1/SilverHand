from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from enum import Enum
import uuid

class ProvenanceStatus(str, Enum):
    SELF_REPORTED = "SELF_REPORTED"
    USER_CONFIRMED = "USER_CONFIRMED"
    EVIDENCE_PROVIDED = "EVIDENCE_PROVIDED"
    HUMAN_REVIEWED = "HUMAN_REVIEWED"
    VERIFIED = "VERIFIED"

class FactProvenance(BaseModel):
    field: str
    value: Any
    source: str = "voice_interview"
    session_id: str
    transcript_reference: str
    status: ProvenanceStatus = ProvenanceStatus.SELF_REPORTED
    model_version: str = "1.0"
    correction_event: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Skill(BaseModel):
    name: str
    experience_years: Optional[float] = Field(default=None, ge=0, le=80)
    experience_months: Optional[int] = Field(default=None, ge=0, le=11)
    specializations: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    languages: List[str] = Field(default_factory=list)
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)
    provenance: List[FactProvenance] = Field(default_factory=list)
    
    @validator('name')
    def validate_skill_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError("Skill name must be at least 2 characters")
        return v.strip()

class Location(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class WorkExample(BaseModel):
    description: str
    skill_name: Optional[str] = None
    duration: Optional[str] = None
    client_type: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class TeachingExperience(BaseModel):
    description: str
    skill_name: Optional[str] = None
    student_count: Optional[int] = None
    duration: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class Availability(BaseModel):
    full_time: bool = False
    part_time: bool = False
    flexible: bool = False
    specific_days: List[str] = Field(default_factory=list)
    specific_hours: Optional[str] = None
    location_constraint: Optional[str] = None
    travel_willingness: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class WorkPreferences(BaseModel):
    preferred_work_type: List[str] = Field(default_factory=list)  # freelance, part-time, contract, full-time
    preferred_industries: List[str] = Field(default_factory=list)
    remote_work_preference: Optional[str] = None
    work_environment: Optional[str] = None
    additional_notes: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class Compensation(BaseModel):
    expected_range: Optional[Dict[str, float]] = None  # {"min": 20000, "max": 30000}
    frequency: Optional[str] = None  # monthly, daily, hourly, project-based
    negotiable: bool = True
    currency: str = "INR"
    additional_benefits: Optional[str] = None
    provenance: List[FactProvenance] = Field(default_factory=list)

class Language(BaseModel):
    name: str
    proficiency: Optional[str] = None  # native, fluent, conversational, basic
    read_write: bool = False
    provenance: List[FactProvenance] = Field(default_factory=list)

class UserProfile(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    age: Optional[int] = Field(default=None, ge=45, le=100)
    gender: Optional[str] = None
    location: Location = Field(default_factory=Location)
    skills: List[Skill] = Field(default_factory=list)
    work_examples: List[WorkExample] = Field(default_factory=list)
    teaching_experience: List[TeachingExperience] = Field(default_factory=list)
    languages: List[Language] = Field(default_factory=list)
    availability: Availability = Field(default_factory=Availability)
    work_preferences: WorkPreferences = Field(default_factory=WorkPreferences)
    compensation: Compensation = Field(default_factory=Compensation)
    profile_description: Optional[str] = None
    description_provenance: List[FactProvenance] = Field(default_factory=list)
    profile_completion_score: float = Field(default=0.0, ge=0.0, le=1.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    active: bool = True
    
    def get_missing_fields(self) -> List[str]:
        """Returns list of missing critical fields"""
        missing = []
        if not self.name:
            missing.append("name")
        if not self.location.city:
            missing.append("location.city")
        if not self.skills:
            missing.append("skills")
        else:
            for i, skill in enumerate(self.skills):
                if not skill.experience_years:
                    missing.append(f"skills[{i}].experience_years")
                if not skill.specializations:
                    missing.append(f"skills[{i}].specializations")
        if not self.availability.full_time and not self.availability.part_time:
            missing.append("availability")
        if not self.work_preferences.preferred_work_type:
            missing.append("work_preferences")
        return missing
    
    def compute_completion_score(self) -> float:
        """Compute profile completion percentage"""
        total_fields = 15
        filled_fields = 0
        
        if self.name: filled_fields += 1
        if self.location.city: filled_fields += 1
        if self.location.state: filled_fields += 1
        if self.skills: filled_fields += 1
        if self.skills and any(s.experience_years for s in self.skills): filled_fields += 1
        if self.skills and any(s.specializations for s in self.skills): filled_fields += 1
        if self.work_examples: filled_fields += 1
        if self.teaching_experience: filled_fields += 1
        if self.languages: filled_fields += 1
        if self.availability.full_time or self.availability.part_time: filled_fields += 1
        if self.work_preferences.preferred_work_type: filled_fields += 1
        if self.compensation.expected_range: filled_fields += 1
        if self.profile_description: filled_fields += 1
        
        self.profile_completion_score = filled_fields / total_fields
        return self.profile_completion_score
