"""
SilverBoost — Fair AI Opportunity Ranking & Boosting Engine for SilverHand
"""

from app.models.matching import (
    CustomerRequest,
    ProviderMatchCandidate,
    ProviderTrustProfile,
    ProviderEngagementProfile,
    ScoreBreakdown,
    RankedProviderResult,
    MatchingResponse,
    AlgorithmWeightsConfig
)

from app.matching.skill_matcher import match_skill, extract_skills_from_text
from app.matching.location_matcher import match_location, extract_location_from_text
from app.matching.availability_matcher import match_availability
from app.matching.trust_scorer import compute_trust_score
from app.matching.fairness_boost import compute_fairness_boost
from app.matching.ranking_engine import (
    SilverBoostRankingEngine,
    compute_experience_score,
    compute_response_rate_score
)
from app.matching.recommendation import rank_providers

__all__ = [
    "CustomerRequest",
    "ProviderMatchCandidate",
    "ProviderTrustProfile",
    "ProviderEngagementProfile",
    "ScoreBreakdown",
    "RankedProviderResult",
    "MatchingResponse",
    "AlgorithmWeightsConfig",
    "match_skill",
    "extract_skills_from_text",
    "match_location",
    "extract_location_from_text",
    "match_availability",
    "compute_trust_score",
    "compute_fairness_boost",
    "SilverBoostRankingEngine",
    "compute_experience_score",
    "compute_response_rate_score",
    "rank_providers"
]
