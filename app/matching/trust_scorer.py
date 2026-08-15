import math
from typing import Tuple
from app.models.matching import ProviderTrustProfile
from app.models.profile import UserProfile, ProvenanceStatus

def compute_trust_score(
    trust_profile: ProviderTrustProfile, 
    user_profile: UserProfile
) -> Tuple[float, str]:
    """
    Computes holistic trust score using multi-factor signals:
    
    Formula:
    Trust Score = 0.40 * Verified Profile +
                  0.30 * Successful Jobs +
                  0.20 * Customer Reviews +
                  0.10 * Evidence / Certificates
                  
    Returns:
        (score: float in [0.0, 1.0], explanation: str)
    """
    # 1. Verified Profile (40%)
    # Identity verified, profile verification status, and provenance verification ratio
    prov_ratio = trust_profile.provenance_verified_ratio
    # Check UserProfile fact provenance if not in trust_profile
    if prov_ratio <= 0.0:
        all_prov = []
        for s in user_profile.skills:
            all_prov.extend(s.provenance)
        for w in user_profile.work_examples:
            all_prov.extend(w.provenance)
        if all_prov:
            verified_count = sum(1 for p in all_prov if p.status in [ProvenanceStatus.VERIFIED, ProvenanceStatus.HUMAN_REVIEWED, ProvenanceStatus.EVIDENCE_PROVIDED])
            prov_ratio = verified_count / len(all_prov)

    id_verified = 1.0 if trust_profile.is_identity_verified else 0.0
    prof_verified = 1.0 if trust_profile.has_profile_verification else 0.0
    
    # Combined profile verification subscore
    profile_verification_subscore = (0.50 * id_verified) + (0.30 * prof_verified) + (0.20 * prov_ratio)
    # Default baseline for completed voice interview with confirmed details
    if user_profile.name and user_profile.skills and profile_verification_subscore < 0.40:
        profile_verification_subscore = max(profile_verification_subscore, 0.50)

    # 2. Successful Jobs (30%)
    # Smooth logarithmic curve where 10+ jobs approaches 1.0
    total_jobs = max(trust_profile.completed_jobs_count, trust_profile.successful_transactions_count)
    if total_jobs <= 0:
        jobs_subscore = 0.0
    elif total_jobs == 1:
        jobs_subscore = 0.40
    elif total_jobs <= 3:
        jobs_subscore = 0.65
    elif total_jobs <= 10:
        jobs_subscore = 0.85
    else:
        jobs_subscore = min(1.0, 0.85 + (0.15 * min(1.0, math.log10(total_jobs) / 2.0)))

    # 3. Customer Reviews (20%)
    # Bayesian smoothed rating: (Rating * N + Prior * M) / (N + M)
    rating = trust_profile.customer_rating
    reviews_count = trust_profile.reviews_count
    if reviews_count > 0 and rating > 0:
        prior_rating = 4.0
        prior_weight = 3.0
        smoothed_rating = (rating * reviews_count + prior_rating * prior_weight) / (reviews_count + prior_weight)
        reviews_subscore = min(1.0, smoothed_rating / 5.0)
    else:
        # Neutral baseline for new providers without reviews
        reviews_subscore = 0.50

    # 4. Evidence / Certificates (10%)
    has_cert = 1.0 if trust_profile.has_skill_certificates else 0.0
    has_work_examples = 1.0 if len(user_profile.work_examples) > 0 else 0.0
    evidence_subscore = (0.60 * has_cert) + (0.40 * has_work_examples)

    # Final combined trust score
    trust_score = (
        0.40 * profile_verification_subscore +
        0.30 * jobs_subscore +
        0.20 * reviews_subscore +
        0.10 * evidence_subscore
    )
    trust_score = round(max(0.0, min(1.0, trust_score)), 4)

    explanation = (
        f"Trust score: {trust_score:.2f} (Profile: {profile_verification_subscore:.2f}, "
        f"Jobs: {jobs_subscore:.2f} [{total_jobs} completed], Reviews: {reviews_subscore:.2f}, "
        f"Evidence: {evidence_subscore:.2f})."
    )
    return trust_score, explanation
