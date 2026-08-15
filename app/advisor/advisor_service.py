from app.advisor.suggestion_engine import SuggestionEngine


class AdvisorService:

    def __init__(self):
        self.engine = SuggestionEngine()

    async def get_advice(
        self,
        user_id: str
    ):

        profile = self.engine.get_profile(
            user_id
        )

        if not profile:
            return {
                "success": False,
                "error": "Provider profile not found"
            }

        similar = await self.engine.find_similar_profiles(
            user_id
        )

        suggestions = await self.engine.ask_gemini(
            profile,
            similar
        )

        return {
            "success": True,
            "user": profile.model_dump(),
            "similar_profiles": [
                {
                    **item["profile"].model_dump(),
                    "match_score": item["score"]
                }
                for item in similar
            ],
            "suggestions": suggestions
        }


advisor_service = AdvisorService()