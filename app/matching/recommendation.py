import math
from typing import List, Union, Dict, Any, Optional
from app.models.matching import (
    CustomerRequest,
    ProviderMatchCandidate,
    RankedProviderResult,
    MatchingResponse,
    AlgorithmWeightsConfig,
    ProviderTrustProfile,
    ProviderEngagementProfile
)
from app.models.profile import UserProfile
from app.matching.ranking_engine import SilverBoostRankingEngine

def _normalize_request(req: Union[CustomerRequest, str, Dict[str, Any]]) -> CustomerRequest:
    """Normalizes various input formats into a CustomerRequest object"""
    if isinstance(req, CustomerRequest):
        return req
    elif isinstance(req, str):
        return CustomerRequest(raw_text=req)
    elif isinstance(req, dict):
        return CustomerRequest(**req)
    else:
        raise ValueError(f"Invalid customer request format: {type(req)}")

def _normalize_candidate(item: Union[ProviderMatchCandidate, UserProfile, Dict[str, Any]]) -> ProviderMatchCandidate:
    """Normalizes input items into ProviderMatchCandidate"""
    if isinstance(item, ProviderMatchCandidate):
        return item
    elif isinstance(item, UserProfile):
        return ProviderMatchCandidate(profile=item)
    elif isinstance(item, dict):
        if "profile" in item:
            profile_data = item["profile"]
            prof = profile_data if isinstance(profile_data, UserProfile) else UserProfile(**profile_data)
            trust = ProviderTrustProfile(**item.get("trust", {})) if isinstance(item.get("trust"), dict) else (item.get("trust") or ProviderTrustProfile())
            eng = ProviderEngagementProfile(**item.get("engagement", {})) if isinstance(item.get("engagement"), dict) else (item.get("engagement") or ProviderEngagementProfile())
            return ProviderMatchCandidate(profile=prof, trust=trust, engagement=eng)
        else:
            return ProviderMatchCandidate(profile=UserProfile(**item))
    else:
        raise ValueError(f"Invalid candidate format: {type(item)}")

def rank_providers(
    customer_request: Union[CustomerRequest, str, Dict[str, Any]],
    providers: List[Union[ProviderMatchCandidate, UserProfile, Dict[str, Any]]],
    weights_config: Optional[AlgorithmWeightsConfig] = None,
    exploration_ratio: float = 0.20,
    top_k: Optional[int] = None
) -> MatchingResponse:
    """
    Main entry point for the SilverBoost Fair AI Opportunity Ranking Engine.
    
    Implements:
    - 80% Exploitation: Top matched providers based on multi-factor scoring
    - 20% Exploration: Opportunity discovery for high-potential new providers,
      senior citizens, homemakers, and underrepresented skills
      
    Args:
        customer_request: Structured CustomerRequest, free-text prompt, or dict
        providers: List of provider candidates
        weights_config: Optional tuning weights
        exploration_ratio: Ratio of slots reserved for exploration (default 0.20 = 20%)
        top_k: Optional limit on number of returned providers
        
    Returns:
        MatchingResponse containing ranked providers, breakdowns, and audit statistics
    """
    req = _normalize_request(customer_request)
    candidates = [_normalize_candidate(p) for p in providers]

    if not candidates:
        return MatchingResponse(
            request_id=req.request_id,
            total_candidates=0,
            ranked_providers=[],
            exploitation_count=0,
            exploration_count=0,
            weights_used=(weights_config or AlgorithmWeightsConfig()).normalized_weights()
        )

    engine = SilverBoostRankingEngine(config=weights_config)
    evaluated: List[RankedProviderResult] = []

    for cand in candidates:
        result = engine.evaluate_candidate(req, cand)
        evaluated.append(result)

    total_count = len(evaluated)
    target_k = min(top_k, total_count) if top_k else total_count

    # If small number of candidates (<= 2), return score ranking directly
    if target_k <= 2 or exploration_ratio <= 0.0:
        evaluated.sort(key=lambda r: r.final_score, reverse=True)
        ranked = evaluated[:target_k]
        return MatchingResponse(
            request_id=req.request_id,
            total_candidates=total_count,
            ranked_providers=ranked,
            exploitation_count=len(ranked),
            exploration_count=0,
            weights_used=engine.config.normalized_weights()
        )

    # Identify exploration eligible candidates (cold start / new providers / high fairness boost)
    num_explore = max(1, int(math.ceil(target_k * exploration_ratio)))
    num_exploit = target_k - num_explore

    # Separate into Established / Exploitation Pool vs Exploration Pool
    exploration_candidates = []
    exploitation_candidates = []

    for r in evaluated:
        is_cold_start = (
            r.breakdown.fairness_boost >= 0.35 or
            (r.provider_trust and r.provider_trust.completed_jobs_count <= 3) or
            (r.provider_engagement and r.provider_engagement.account_age_days <= 45)
        )
        if is_cold_start and r.breakdown.skill_match >= 0.30:
            exploration_candidates.append(r)
        else:
            exploitation_candidates.append(r)

    # Sort both pools by relevant metrics
    exploitation_candidates.sort(key=lambda r: r.final_score, reverse=True)
    exploration_candidates.sort(
        key=lambda r: (r.final_score + 0.30 * r.breakdown.fairness_boost), 
        reverse=True
    )

    # Pick top exploit candidates
    exploit_picks = exploitation_candidates[:num_exploit]
    selected_ids = {r.provider_id for r in exploit_picks}

    # Pick top exploration candidates
    explore_picks: List[RankedProviderResult] = []
    for exp_item in exploration_candidates:
        if exp_item.provider_id not in selected_ids:
            marked_item = exp_item.model_copy(update={
                "is_exploration_pick": True,
                "boost_reason": exp_item.boost_reason or "Discovered via SilverBoost Opportunity Exploration (New / High Potential Provider)"
            })
            explore_picks.append(marked_item)
            selected_ids.add(exp_item.provider_id)
            if len(explore_picks) >= num_explore:
                break

    # If exploration pool didn't fill requested quota, backfill from remaining candidates
    if len(explore_picks) < num_explore:
        for r in (exploitation_candidates + exploration_candidates):
            if r.provider_id not in selected_ids:
                explore_picks.append(r)
                selected_ids.add(r.provider_id)
                if len(explore_picks) >= num_explore:
                    break

    # If exploit pool didn't fill quota, backfill similarly
    if len(exploit_picks) < num_exploit:
        for r in (exploitation_candidates + exploration_candidates):
            if r.provider_id not in selected_ids:
                exploit_picks.append(r)
                selected_ids.add(r.provider_id)
                if len(exploit_picks) >= num_exploit:
                    break

    # Blend 80% Exploitation + 20% Exploration into final ranked list
    final_ranked: List[RankedProviderResult] = []
    exploit_idx = 0
    explore_idx = 0

    for i in range(target_k):
        # Place exploration candidate at discovery slot (e.g. index 2, 5, etc.)
        if (i % 3 == 2 or exploit_idx >= len(exploit_picks)) and explore_idx < len(explore_picks):
            final_ranked.append(explore_picks[explore_idx])
            explore_idx += 1
        elif exploit_idx < len(exploit_picks):
            final_ranked.append(exploit_picks[exploit_idx])
            exploit_idx += 1
        elif explore_idx < len(explore_picks):
            final_ranked.append(explore_picks[explore_idx])
            explore_idx += 1

    actual_explore_count = sum(1 for r in final_ranked if r.is_exploration_pick)
    actual_exploit_count = len(final_ranked) - actual_explore_count

    return MatchingResponse(
        request_id=req.request_id,
        total_candidates=total_count,
        ranked_providers=final_ranked,
        exploitation_count=actual_exploit_count,
        exploration_count=actual_explore_count,
        weights_used=engine.config.normalized_weights()
    )
