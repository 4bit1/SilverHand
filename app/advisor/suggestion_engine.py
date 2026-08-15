import sqlite3
import json
import logging
import os
from typing import List, Dict, Any

from google import genai

from app.advisor.models import ProviderProfile

logger = logging.getLogger(__name__)


class SuggestionEngine:

    def __init__(
        self,
        db_path: str = "elderskill.db",
        gemini_model: str = "gemini-3.5-flash"
    ):
        self.db_path = db_path
        self.gemini_model = gemini_model

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            logger.warning(
                "GEMINI_API_KEY environment variable not found"
            )
            self.client = None
        else:
            self.client = genai.Client(
                api_key=api_key
            )

    # ---------------------------------------------------------
    # DATABASE
    # ---------------------------------------------------------

    def get_profile(
        self,
        user_id: str
    ) -> ProviderProfile | None:

        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                u.id,
                u.full_name,
                u.email,
                p.primary_skill,
                p.years_of_experience,
                p.location_city,
                p.summary
            FROM users u
            JOIN profiles p
            ON u.id = p.user_id
            WHERE u.id = ?
            """,
            (user_id,)
        )

        row = cursor.fetchone()

        if not row:
            conn.close()
            return None

        cursor.execute(
            """
            SELECT skill_name
            FROM skills
            WHERE user_id = ?
            """,
            (user_id,)
        )

        skills = [
            r["skill_name"]
            for r in cursor.fetchall()
        ]

        conn.close()

        return ProviderProfile(
            user_id=row["id"],
            name=row["full_name"],
            email=row["email"],
            primary_skill=row["primary_skill"],
            years_of_experience=row["years_of_experience"],
            location=row["location_city"],
            skills=skills,
            summary=row["summary"]
        )

    # ---------------------------------------------------------
    # ADVISOR PROFILES
    # ---------------------------------------------------------

    def get_all_profiles(
        self
    ) -> List[ProviderProfile]:

        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        cursor.execute(
            """
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
            """
        )

        rows = cursor.fetchall()

        profiles = []

        for row in rows:

            skills = []

            if row["skills"]:

                skills = [
                    skill.strip()
                    for skill in row["skills"].split(",")
                    if skill.strip()
                ]

            profiles.append(
                ProviderProfile(
                    user_id=row["id"],
                    name=row["name"],
                    email=row["email"],
                    primary_skill=row["primary_skill"],
                    years_of_experience=row[
                        "years_of_experience"
                    ],
                    location=row["location"],
                    skills=skills,
                    summary=row["summary"]
                )
            )

        conn.close()

        return profiles

    # ---------------------------------------------------------
    # MATCHING
    # ---------------------------------------------------------

    def calculate_match_score(
        self,
        target: ProviderProfile,
        candidate: ProviderProfile
    ) -> float:

        score = 0.0

        # ---------------------------------------
        # Skills - 50 points
        # ---------------------------------------

        target_skills = {
            skill.strip().lower()
            for skill in target.skills
            if skill
        }

        candidate_skills = {
            skill.strip().lower()
            for skill in candidate.skills
            if skill
        }

        if target_skills and candidate_skills:

            overlap = target_skills.intersection(
                candidate_skills
            )

            skill_score = (
                len(overlap) /
                len(target_skills)
            ) * 50

            score += skill_score

        # ---------------------------------------
        # Primary skill - 20 points
        # ---------------------------------------

        if (
            target.primary_skill
            and candidate.primary_skill
            and target.primary_skill.lower()
            == candidate.primary_skill.lower()
        ):
            score += 20

        # ---------------------------------------
        # Location - 10 points
        # ---------------------------------------

        if (
            target.location
            and candidate.location
            and target.location.lower()
            == candidate.location.lower()
        ):
            score += 10

        # ---------------------------------------
        # Experience - 20 points
        # ---------------------------------------

        if (
            target.years_of_experience is not None
            and candidate.years_of_experience is not None
        ):

            difference = abs(
                target.years_of_experience
                - candidate.years_of_experience
            )

            if difference <= 2:
                score += 20

            elif difference <= 5:
                score += 15

            elif difference <= 10:
                score += 10

            elif difference <= 15:
                score += 5

        return round(score, 2)

    # ---------------------------------------------------------
    # FIND SIMILAR PROFILES
    # ---------------------------------------------------------

    async def find_similar_profiles(
        self,
        user_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:

        target = self.get_profile(user_id)

        if not target:
            return []

        profiles = self.get_all_profiles()

        candidates = []

        for profile in profiles:

            score = self.calculate_match_score(
                target,
                profile
            )

            candidates.append(
                {
                    "profile": profile,
                    "score": score
                }
            )

        candidates.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return candidates[:limit]

    # ---------------------------------------------------------
    # GEMINI
    # ---------------------------------------------------------

    async def ask_gemini(
        self,
        profile: ProviderProfile,
        similar_profiles: List[Dict[str, Any]]
    ) -> Dict[str, Any]:

        if not self.client:

            return {
                "roles": [],
                "skills_to_develop": [],
                "industries": [],
                "opportunities": [],
                "explanation": (
                    "Gemini API key is not configured."
                )
            }

        # ---------------------------------------
        # Prepare similar profiles
        # ---------------------------------------

        similar_text = ""

        for item in similar_profiles:

            p = item["profile"]

            similar_text += f"""
Name: {p.name}
Primary Skill: {p.primary_skill}
Experience: {p.years_of_experience} years
Location: {p.location}
Skills: {", ".join(p.skills)}
Summary: {p.summary}
Match Score: {item["score"]}
---
"""

        # ---------------------------------------
        # Prompt
        # ---------------------------------------

        prompt = f"""
You are the AI Advisor for ElderSkill.

Your job is to provide practical career,
livelihood and work recommendations for
experienced professionals.

Analyze the provider profile and the
similar provider profiles.

PROVIDER:

Name:
{profile.name}

Primary Skill:
{profile.primary_skill}

Experience:
{profile.years_of_experience} years

Location:
{profile.location}

Skills:
{", ".join(profile.skills)}

Profile Summary:
{profile.summary}


SIMILAR PROVIDERS:

{similar_text}


Based only on the information provided,
generate realistic and practical recommendations.

Do not invent qualifications, certifications,
skills or experience that the provider does not have.

Return ONLY valid JSON in exactly this structure:

{{
    "roles": [
        "role 1",
        "role 2",
        "role 3"
    ],
    "skills_to_develop": [
        "skill 1",
        "skill 2",
        "skill 3"
    ],
    "industries": [
        "industry 1",
        "industry 2"
    ],
    "opportunities": [
        "opportunity 1",
        "opportunity 2",
        "opportunity 3"
    ],
    "explanation": "Short personalized explanation"
}}
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

            return self._parse_gemini_response(
                content
            )

        except Exception as e:

            logger.exception(
                "Gemini Advisor request failed"
            )

            print("\n❌ GEMINI ERROR:")
            print(type(e).__name__)
            print(str(e))

            return {
                "roles": [],
                "skills_to_develop": [],
                "industries": [],
                "opportunities": [],
                "explanation": (
                    "Unable to generate AI suggestions "
                    "at the moment."
                )
            }

    # ---------------------------------------------------------
    # PARSE GEMINI RESPONSE
    # ---------------------------------------------------------

    def _parse_gemini_response(
        self,
        content: str
    ) -> Dict[str, Any]:

        content = content.strip()

        # Remove markdown if Gemini returns it
        if "```json" in content:

            content = (
                content
                .split("```json", 1)[1]
                .split("```", 1)[0]
                .strip()
            )

        elif "```" in content:

            content = (
                content
                .split("```", 1)[1]
                .split("```", 1)[0]
                .strip()
            )

        try:

            result = json.loads(content)

            return {
                "roles": result.get(
                    "roles", []
                ),
                "skills_to_develop": result.get(
                    "skills_to_develop", []
                ),
                "industries": result.get(
                    "industries", []
                ),
                "opportunities": result.get(
                    "opportunities", []
                ),
                "explanation": result.get(
                    "explanation", ""
                )
            }

        except json.JSONDecodeError:

            return {
                "roles": [],
                "skills_to_develop": [],
                "industries": [],
                "opportunities": [],
                "explanation": content
            }