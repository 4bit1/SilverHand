import sqlite3
import json
import logging
from typing import List, Dict, Any

from google import genai

from app.customer.models import CustomerSearchResult

logger = logging.getLogger(__name__)


class CustomerSearchEngine:

    def __init__(
        self,
        db_path: str = "elderskill.db",
        gemini_model: str = "gemini-3.5-flash"
    ):
        self.db_path = db_path
        self.gemini_model = gemini_model

        self.client = genai.Client()

    # ---------------------------------------------------------
    # GET ALL PROVIDERS
    # ---------------------------------------------------------

    def get_all_providers(self):

        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                primary_skill,
                years_of_experience,
                location,
                skills,
                summary
            FROM advisor_profiles
            WHERE is_active = 1
        """)

        rows = cursor.fetchall()

        providers = []

        for row in rows:

            skills = []

            if row["skills"]:
                skills = [
                    skill.strip()
                    for skill in row["skills"].split(",")
                    if skill.strip()
                ]

            providers.append({
                "user_id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "primary_skill": row["primary_skill"],
                "years_of_experience":
                    row["years_of_experience"],
                "location": row["location"],
                "skills": skills,
                "summary": row["summary"]
            })

        conn.close()

        return providers

    # ---------------------------------------------------------
    # GEMINI QUERY UNDERSTANDING
    # ---------------------------------------------------------

    async def understand_query(
        self,
        query: str
    ) -> Dict[str, Any]:

        prompt = f"""
You are the search understanding system for ElderSkill.

A customer is searching for a product or service.

Customer query:
"{query}"

Identify what service/product the customer needs
and what skills a provider should have.

Return ONLY valid JSON:

{{
    "service": "short description of requested service",
    "required_skills": [
        "skill 1",
        "skill 2",
        "skill 3"
    ]
}}

Important:
- Do not invent unnecessary skills.
- Extract skills that are genuinely relevant.
- Understand natural language.
- The customer may search for technical or
  non-technical services.
"""

        try:

            response = self.client.models.generate_content(
                model=self.gemini_model,
                contents=prompt,
                config={
                    "response_mime_type": "application/json"
                }
            )

            content = response.text.strip()

            return json.loads(content)

        except Exception as e:

            logger.exception(
                "Gemini query understanding failed"
            )

            return {
                "service": query,
                "required_skills": []
            }

    # ---------------------------------------------------------
    # MATCHING
    # ---------------------------------------------------------

    def calculate_match_score(
        self,
        required_skills: List[str],
        provider: Dict[str, Any],
        location: str | None = None
    ) -> float:

        score = 0.0

        required = {
            skill.lower().strip()
            for skill in required_skills
        }

        provider_skills = {
            skill.lower().strip()
            for skill in provider["skills"]
        }

        # ---------------------------------------
        # Skill match - 70 points
        # ---------------------------------------

        if required:

            overlap = required.intersection(
                provider_skills
            )

            skill_score = (
                len(overlap) / len(required)
            ) * 70

            score += skill_score

        # ---------------------------------------
        # Primary skill - 15 points
        # ---------------------------------------

        primary_skill = (
            provider["primary_skill"] or ""
        ).lower()

        if any(
            skill in primary_skill
            or primary_skill in skill
            for skill in required
        ):
            score += 15

        # ---------------------------------------
        # Experience - 10 points
        # ---------------------------------------

        experience = provider[
            "years_of_experience"
        ]

        if experience:

            if experience >= 10:
                score += 10
            elif experience >= 5:
                score += 7
            elif experience >= 2:
                score += 5

        # ---------------------------------------
        # Location - 5 points
        # ---------------------------------------

        if (
            location
            and provider["location"]
            and location.lower()
            == provider["location"].lower()
        ):
            score += 5

        return round(min(score, 100), 2)

    # ---------------------------------------------------------
    # GENERATE REASON
    # ---------------------------------------------------------

    def create_match_reason(
        self,
        required_skills: List[str],
        provider: Dict[str, Any]
    ) -> str:

        required = {
            skill.lower()
            for skill in required_skills
        }

        provider_skills = {
            skill.lower()
            for skill in provider["skills"]
        }

        matched = required.intersection(
            provider_skills
        )

        if matched:

            skills = ", ".join(
                sorted(matched)
            )

            return (
                f"Strong match because the provider "
                f"has relevant skills: {skills}."
            )

        return (
            "Provider has relevant experience "
            "in this service area."
        )

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------

    async def search(
        self,
        query: str,
        location: str | None = None,
        limit: int = 5
    ):

        # 1. Understand customer request

        understanding = await self.understand_query(
            query
        )

        service = understanding.get(
            "service",
            query
        )

        required_skills = understanding.get(
            "required_skills",
            []
        )

        # 2. Get providers

        providers = self.get_all_providers()

        results = []

        # 3. Calculate scores

        for provider in providers:

            score = self.calculate_match_score(
                required_skills,
                provider,
                location
            )

            reason = self.create_match_reason(
                required_skills,
                provider
            )

            results.append(
                CustomerSearchResult(
                    user_id=provider["user_id"],
                    name=provider["name"],
                    email=provider["email"],
                    primary_skill=provider[
                        "primary_skill"
                    ],
                    years_of_experience=provider[
                        "years_of_experience"
                    ],
                    location=provider["location"],
                    skills=provider["skills"],
                    summary=provider["summary"],
                    match_score=score,
                    match_reason=reason
                )
            )

        # 4. Rank

        results.sort(
            key=lambda x: x.match_score,
            reverse=True
        )

        # 5. Return top providers

        return {
            "service": service,
            "required_skills": required_skills,
            "results": [
                result.model_dump()
                for result in results[:limit]
            ]
        }