from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
import uuid
from app.models.profile import UserProfile, Location, Availability, Skill

class AlgorithmWeightsConfig(BaseModel):
    """
    Configurable weights for the SilverHands Boosting Algorithm.
    Formula:
    FinalScore = 0.30*Skill + 0.20*Location + 0.15*Availability + 0.10*Trust + 
                 0.10*ProfileQuality + 0.05*Experience + 0.05*ResponseRate + 0.05*FairnessBoost
    """
    skill_match_weight: float = Field(default=0.30, ge=0.0, le=1.0)
    location_match_weight: float = Field(default=0.20, ge=0.0, le=1.0)
    availability_match_weight: float = Field(default=0.15, ge=0.0, le=1.0)
    trust_score_weight: float = Field(default=0.10, ge=0.0, le=1.0)
    profile_quality_weight: float = Field(default=0.10, ge=0.0, le=1.0)
    experience_weight: float = Field(default=0.05, ge=0.0, le=1.0)
    response_rate_weight: float = Field(default=0.05, ge=0.0, le=1.0)
    fairness_boost_weight: float = Field(default=0.05, ge=0.0, le=1.0)

    def normalized_weights(self) -> Dict[str, float]:
        """Returns normalized weights summing to 1.0"""
        total = (
            self.skill_match_weight +
            self.location_match_weight +
            self.availability_match_weight +
            self.trust_score_weight +
            self.profile_quality_weight +
            self.experience_weight +
            self.response_rate_weight +
            self.fairness_boost_weight
        )
        if total <= 0:
            total = 1.0
        return {
            "skill_match": self.skill_match_weight / total,
            "location_match": self.location_match_weight / total,
            "availability_match": self.availability_match_weight / total,
            "trust_score": self.trust_score_weight / total,
            "profile_quality": self.profile_quality_weight / total,
            "experience": self.experience_weight / total,
            "response_rate": self.response_rate_weight / total,
            "fairness_boost": self.fairness_boost_weight / total,
        }

class CustomerRequest(BaseModel):
    """
    Incoming customer requirement for a service.
    Can be structured or derived from free-text voice/text requests.
    """
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    raw_text: Optional[str] = None
    required_skills: List[str] = Field(default_factory=list)
    category: Optional[str] = None
    location: Optional[Location] = Field(default_factory=Location)
    locality: Optional[str] = None
    is_remote: bool = False
    preferred_days: List[str] = Field(default_factory=list) # e.g. ["Saturday", "Sunday"]
    preferred_time_slots: List[str] = Field(default_factory=list) # e.g. ["10:00-12:00", "Morning"]
    target_audience: Optional[str] = None # e.g. "kids", "daughter", "adults"
    min_experience_years: Optional[float] = None
    budget_range: Optional[Dict[str, float]] = None
    language_preference: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProviderTrustProfile(BaseModel):
    """
    Trust metrics for service provider:
    Trust Score = 40% verified profile + 30% successful jobs + 20% customer reviews + 10% evidence/certificates
    """
    is_identity_verified: bool = False
    completed_jobs_count: int = 0
    customer_rating: float = Field(default=0.0, ge=0.0, le=5.0)
    reviews_count: int = 0
    successful_transactions_count: int = 0
    has_profile_verification: bool = False
    has_skill_certificates: bool = False
    provenance_verified_ratio: float = Field(default=0.0, ge=0.0, le=1.0)

class ProviderEngagementProfile(BaseModel):
    """
    Behavioral and fairness-related profile attributes.
    """
    response_rate: float = Field(default=1.0, ge=0.0, le=1.0) # e.g. 0.95 -> 1.0 score
    avg_response_time_minutes: Optional[float] = None
    account_age_days: int = 0 # 0-30 days: Strong boost, 31-60: Moderate boost, >60: Mature
    is_senior_citizen: bool = False
    is_homemaker: bool = False
    underrepresented_skill: bool = False
    total_impressions: int = 0
    total_clicks: int = 0

class ProviderMatchCandidate(BaseModel):
    """
    Full candidate entity passed into the ranking engine.
    Wraps the core UserProfile with optional trust & engagement extensions.
    """
    profile: UserProfile
    trust: ProviderTrustProfile = Field(default_factory=ProviderTrustProfile)
    engagement: ProviderEngagementProfile = Field(default_factory=ProviderEngagementProfile)

class ScoreBreakdown(BaseModel):
    """
    Detailed, transparent breakdown of each subscore contributing to FinalScore.
    """
    skill_match: float = Field(default=0.0, ge=0.0, le=1.0)
    location_match: float = Field(default=0.0, ge=0.0, le=1.0)
    availability_match: float = Field(default=0.0, ge=0.0, le=1.0)
    trust_score: float = Field(default=0.0, ge=0.0, le=1.0)
    profile_quality: float = Field(default=0.0, ge=0.0, le=1.0)
    experience_score: float = Field(default=0.0, ge=0.0, le=1.0)
    response_rate_score: float = Field(default=0.0, ge=0.0, le=1.0)
    fairness_boost: float = Field(default=0.0, ge=0.0, le=1.0)
    
    # Sub-component explanations for UI/debugging
    skill_explanation: Optional[str] = None
    location_explanation: Optional[str] = None
    availability_explanation: Optional[str] = None
    trust_explanation: Optional[str] = None
    fairness_explanation: Optional[str] = None
    raw_experience_years: float = 0.0

class RankedProviderResult(BaseModel):
    """
    Final ranked output for a single provider.
    """
    provider_id: str
    provider_name: Optional[str] = None
    final_score: float = Field(ge=0.0, le=1.0)
    breakdown: ScoreBreakdown
    is_exploration_pick: bool = False
    boost_reason: Optional[str] = None
    provider_profile: Optional[UserProfile] = None
    provider_trust: Optional[ProviderTrustProfile] = None
    provider_engagement: Optional[ProviderEngagementProfile] = None

class MatchingResponse(BaseModel):
    """
    Response returned by the SilverBoost engine.
    """
    request_id: str
    total_candidates: int
    ranked_providers: List[RankedProviderResult]
    exploitation_count: int
    exploration_count: int
    algorithm_version: str = "SilverBoost-v1.0"
    weights_used: Dict[str, float]
