from typing import Tuple, Dict, Any
from app.models.matching import ProviderEngagementProfile, ProviderTrustProfile
from app.models.profile import UserProfile

UNDERREPRESENTED_SKILL_KEYWORDS = [
    "embroidery", "crochet", "knitting", "zari", "aari", "handicraft", "pottery",
    "sloka", "carnatic", "hindustani", "vedic", "sanskrit", "storytelling",
    "traditional cooking", "baking", "gardening", "organic farming", "origami",
    "classical music", "classical dance", "bharatanatyam", "folk art"
]

def compute_fairness_boost(
    user_profile: UserProfile,
    trust_profile: ProviderTrustProfile,
    engagement_profile: ProviderEngagementProfile
) -> Tuple[float, str]:
    """
    Computes fairness opportunity boost to solve the cold-start problem
    and empower senior citizens & homemakers without established digital transaction history.
    
    Components:
    1. New User Opportunity Boost (Controlled time decay):
       - Days 0-30: 1.0 (Strong exploration boost)
       - Days 31-60: 0.5 (Moderate boost)
       - Days > 60: 0.0 (Performance-driven)
    2. Underrepresented / Traditional Skill Boost:
       - 0.8 - 1.0 if possessing niche cultural or artisanal skills
    3. Profile Quality Opportunity Boost:
       - Rewards high-effort profiles (profile_completion_score >= 70%) with 0 or few transactions
    4. Senior & Homemaker Demographic Boost:
       - Explicit empowerment for 50+ seniors and homemakers
       
    Returns:
        (boost_score: float in [0.0, 1.0], explanation: str)
    """
    reasons = []
    
    # 1. New User Opportunity Boost
    account_age = engagement_profile.account_age_days
    completed_jobs = trust_profile.completed_jobs_count
    
    new_user_boost = 0.0
    if completed_jobs <= 3:
        if account_age <= 30:
            new_user_boost = 1.0
            reasons.append("New provider exploration window (Days 0-30)")
        elif account_age <= 60:
            new_user_boost = 0.50
            reasons.append("New provider transition window (Days 31-60)")
        else:
            new_user_boost = 0.15 # Long-time user with low transactions still gets slight opportunity
    
    # 2. Underrepresented Skill Boost
    underrepresented_boost = 0.0
    cand_skill_text = " ".join([s.name + " " + " ".join(s.specializations) for s in user_profile.skills]).lower()
    
    if engagement_profile.underrepresented_skill:
        underrepresented_boost = 0.90
        reasons.append("Rare/Underrepresented skill provider")
    elif any(kw in cand_skill_text for kw in UNDERREPRESENTED_SKILL_KEYWORDS):
        underrepresented_boost = 0.80
        reasons.append("Heritage/Traditional artisanal skill match")

    # 3. Profile Quality Opportunity Boost
    # If user took effort to fill full profile via voice interview
    profile_score = user_profile.profile_completion_score
    if profile_score <= 0.0:
        profile_score = user_profile.compute_completion_score()
        
    profile_quality_boost = 0.0
    if profile_score >= 0.70 and completed_jobs <= 5:
        profile_quality_boost = profile_score
        reasons.append(f"High profile completeness ({int(profile_score*100)}%) with low job count")

    # 4. Senior Citizen / Homemaker Affinity Boost
    demographic_boost = 0.0
    if (user_profile.age and user_profile.age >= 50) or engagement_profile.is_senior_citizen:
        demographic_boost = 0.75
        reasons.append("Senior citizen empowerment factor")
    elif engagement_profile.is_homemaker:
        demographic_boost = 0.70
        reasons.append("Homemaker livelihood empowerment factor")

    # Combined weighted FairnessBoost
    # 40% New User + 25% Underrepresented + 20% Profile Quality + 15% Demographic
    fairness_score = (
        0.40 * new_user_boost +
        0.25 * underrepresented_boost +
        0.20 * profile_quality_boost +
        0.15 * demographic_boost
    )
    
    fairness_score = round(max(0.0, min(1.0, fairness_score)), 4)
    explanation = f"Fairness boost: {fairness_score:.2f} (" + "; ".join(reasons) + ")" if reasons else "Standard baseline fairness."

    return fairness_score, explanation
