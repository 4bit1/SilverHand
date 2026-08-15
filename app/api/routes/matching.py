from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from app.models.matching import (
    CustomerRequest,
    ProviderMatchCandidate,
    RankedProviderResult,
    MatchingResponse,
    AlgorithmWeightsConfig,
    ScoreBreakdown
)
from app.models.profile import UserProfile, Location
from app.matching.recommendation import rank_providers
from app.matching.ranking_engine import SilverBoostRankingEngine
from app.matching.skill_matcher import extract_skills_from_text
from app.matching.location_matcher import extract_location_from_text
from app.matching.availability_matcher import extract_days_from_text, extract_time_slots_from_text

router = APIRouter(prefix="/api/matching", tags=["SilverBoost Matching Engine"])

class BatchRankRequest(BaseModel):
    request: Union[CustomerRequest, Dict[str, Any], str]
    providers: List[Union[ProviderMatchCandidate, UserProfile, Dict[str, Any]]]
    weights: Optional[AlgorithmWeightsConfig] = None
    exploration_ratio: float = Field(default=0.20, ge=0.0, le=1.0)
    top_k: Optional[int] = None

class ParseQueryRequest(BaseModel):
    query: str

class SingleEvaluateRequest(BaseModel):
    request: Union[CustomerRequest, Dict[str, Any], str]
    candidate: Union[ProviderMatchCandidate, UserProfile, Dict[str, Any]]
    weights: Optional[AlgorithmWeightsConfig] = None

@router.get("/config")
async def get_algorithm_config():
    """Returns the default weights configuration for SilverBoost"""
    default_config = AlgorithmWeightsConfig()
    return {
        "success": True,
        "weights": default_config.model_dump(),
        "normalized_weights": default_config.normalized_weights(),
        "algorithm": "SilverBoost — Fair AI Opportunity Ranking Engine",
        "version": "1.0"
    }

@router.post("/parse-request")
async def parse_customer_query(req: ParseQueryRequest):
    """
    Parses natural language requirements (voice/text) into a structured CustomerRequest.
    """
    text = req.query.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    extracted_skills = extract_skills_from_text(text)
    extracted_city = extract_location_from_text(text)
    extracted_days = list(extract_days_from_text(text))
    extracted_slots = list(extract_time_slots_from_text(text))
    
    is_remote = any(w in text.lower() for w in ["remote", "online", "zoom", "virtual", "work from home"])

    parsed = CustomerRequest(
        raw_text=text,
        required_skills=extracted_skills,
        location=Location(city=extracted_city.title() if extracted_city else None),
        is_remote=is_remote,
        preferred_days=extracted_days,
        preferred_time_slots=extracted_slots
    )

    return {
        "success": True,
        "data": parsed
    }

@router.post("/rank", response_model=MatchingResponse)
async def rank_candidates(payload: BatchRankRequest):
    """
    Ranks a list of candidate service providers against a customer request using SilverBoost.
    Includes 80% exploitation + 20% exploration opportunity discovery.
    """
    try:
        response = rank_providers(
            customer_request=payload.request,
            providers=payload.providers,
            weights_config=payload.weights,
            exploration_ratio=payload.exploration_ratio,
            top_k=payload.top_k
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ranking failed: {str(e)}")

@router.post("/evaluate-single", response_model=RankedProviderResult)
async def evaluate_single_candidate(payload: SingleEvaluateRequest):
    """
    Evaluates and generates a detailed mathematical score breakdown for a single provider candidate.
    """
    try:
        engine = SilverBoostRankingEngine(config=payload.weights)
        
        # Normalize request
        if isinstance(payload.request, CustomerRequest):
            req = payload.request
        elif isinstance(payload.request, str):
            req = CustomerRequest(raw_text=payload.request)
        else:
            req = CustomerRequest(**payload.request)

        # Normalize candidate
        if isinstance(payload.candidate, ProviderMatchCandidate):
            cand = payload.candidate
        elif isinstance(payload.candidate, UserProfile):
            cand = ProviderMatchCandidate(profile=payload.candidate)
        elif isinstance(payload.candidate, dict):
            if "profile" in payload.candidate:
                prof = payload.candidate["profile"]
                p = prof if isinstance(prof, UserProfile) else UserProfile(**prof)
                cand = ProviderMatchCandidate(profile=p)
            else:
                cand = ProviderMatchCandidate(profile=UserProfile(**payload.candidate))
        else:
            raise ValueError(f"Invalid candidate type: {type(payload.candidate)}")

        result = engine.evaluate_candidate(req, cand)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
