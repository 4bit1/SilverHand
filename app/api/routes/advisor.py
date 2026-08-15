from fastapi import APIRouter, HTTPException

from app.advisor.advisor_service import advisor_service


router = APIRouter(
    prefix="/api/advisor",
    tags=["AI Advisor"]
)


@router.get("/{user_id}")
async def get_advisor(user_id: str):

    result = await advisor_service.get_advice(
        user_id
    )

    if not result["success"]:

        raise HTTPException(
            status_code=404,
            detail=result["error"]
        )

    return result


@router.get("/{user_id}/similar")
async def get_similar_profiles(
    user_id: str
):

    engine = advisor_service.engine

    profile = engine.get_profile(user_id)

    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Provider profile not found"
        )

    similar = await engine.find_similar_profiles(
        user_id
    )

    return {
        "success": True,
        "profiles": [
            {
                **item["profile"].model_dump(),
                "match_score": item["score"]
            }
            for item in similar
        ]
    }