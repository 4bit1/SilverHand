import math
from typing import List, Tuple, Optional, Dict, Any
from app.models.matching import (
    CustomerRequest, 
    ProviderMatchCandidate, 
    ScoreBreakdown, 
    RankedProviderResult, 
    AlgorithmWeightsConfig
)
from app.models.profile import UserProfile
from app.matching.skill_matcher import match_skill
from app.matching.location_matcher import match_location
from app.matching.availability_matcher import match_availability
from app.matching.trust_scorer import compute_trust_score
from app.matching.fairness_boost import compute_fairness_boost

def compute_experience_score(candidate: UserProfile) -> Tuple[float, float]:
    """
    Computes experience score with diminishing returns and capping.
    
    Calibration:
    - 1 year   -> ~0.35
    - 5 years  -> ~0.65
    - 15 years -> ~0.88
    - 25+ years -> ~0.98 - 1.00 (Capped)
    
    Returns:
        (normalized_score: float in [0.0, 1.0], max_years: float)
    """
    years_list = []
    for s in candidate.skills:
        if s.experience_years is not None:
            years_list.append(float(s.experience_years))
    
    # Fallback to age-based work estimate if senior
    if not years_list and candidate.age and candidate.age >= 50:
        years_list.append(max(5.0, float(candidate.age - 25)))
        
    max_years = max(years_list) if years_list else 0.0
    
    if max_years <= 0.0:
        return 0.20, 0.0
    
    # Diminishing returns curve capped at 25-30 years
    # Score = 1 - exp(-years / 7.5)
    score = 1.0 - math.exp(-max_years / 7.5)
    normalized = round(min(1.0, max(0.0, score)), 4)
    return normalized, max_years

def compute_response_rate_score(response_rate: float) -> float:
    """
    Maps response rate to score:
    - 95%+ -> 1.0
    - 75%  -> 0.75
    - 50%  -> 0.50
    """
    if response_rate >= 0.95:
        return 1.0
    if response_rate <= 0.0:
        return 0.30 # Default baseline for new users who haven't received requests yet
    return round(min(1.0, max(0.0, response_rate)), 4)

class SilverBoostRankingEngine:
    """
    Core Ranking Engine implementing the SilverHands Boosting Algorithm.
    """
    def __init__(self, config: Optional[AlgorithmWeightsConfig] = None):
        self.config = config or AlgorithmWeightsConfig()

    def evaluate_candidate(
        self, 
        request: CustomerRequest, 
        candidate: ProviderMatchCandidate
    ) -> RankedProviderResult:
        """
        Evaluates a single provider candidate against customer request and computes FinalScore.
        """
        user_prof = candidate.profile
        trust_prof = candidate.trust
        eng_prof = candidate.engagement

        # 1. Skill Match (30%)
        skill_score, skill_exp = match_skill(request, user_prof)

        # 2. Location Match (20%)
        loc_score, loc_exp = match_location(request, user_prof)

        # 3. Availability Match (15%)
        avail_score, avail_exp = match_availability(request, user_prof)

        # 4. Trust Score (10%)
        trust_score, trust_exp = compute_trust_score(trust_prof, user_prof)

        # 5. Profile Quality (10%)
        profile_quality = user_prof.profile_completion_score
        if profile_quality <= 0.0:
            profile_quality = user_prof.compute_completion_score()
        profile_quality = round(min(1.0, max(0.0, profile_quality)), 4)

        # 6. Experience (5%)
        exp_score, raw_years = compute_experience_score(user_prof)

        # 7. Response Rate (5%)
        resp_score = compute_response_rate_score(eng_prof.response_rate)

        # 8. Fairness Boost (5%)
        fairness_score, fairness_exp = compute_fairness_boost(user_prof, trust_prof, eng_prof)

        # Get active weights
        w = self.config.normalized_weights()

        final_score = (
            w["skill_match"] * skill_score +
            w["location_match"] * loc_score +
            w["availability_match"] * avail_score +
            w["trust_score"] * trust_score +
            w["profile_quality"] * profile_quality +
            w["experience"] * exp_score +
            w["response_rate"] * resp_score +
            w["fairness_boost"] * fairness_score
        )
        final_score = round(max(0.0, min(1.0, final_score)), 4)

        breakdown = ScoreBreakdown(
            skill_match=skill_score,
            location_match=loc_score,
            availability_match=avail_score,
            trust_score=trust_score,
            profile_quality=profile_quality,
            experience_score=exp_score,
            response_rate_score=resp_score,
            fairness_boost=fairness_score,
            skill_explanation=skill_exp,
            location_explanation=loc_exp,
            availability_explanation=avail_exp,
            trust_explanation=trust_exp,
            fairness_explanation=fairness_exp,
            raw_experience_years=raw_years
        )

        return RankedProviderResult(
            provider_id=user_prof.user_id,
            provider_name=user_prof.name or "Anonymous Provider",
            final_score=final_score,
            breakdown=breakdown,
            is_exploration_pick=False,
            boost_reason=fairness_exp if fairness_score > 0.40 else None,
            provider_profile=user_prof,
            provider_trust=trust_prof,
            provider_engagement=eng_prof
        )
