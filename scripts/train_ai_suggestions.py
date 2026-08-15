import sqlite3
import json
from collections import Counter


DB_PATH = "elderskill.db"


def train_advisor():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # ---------------------------------------
    # Check advisor profiles
    # ---------------------------------------

    cursor.execute("""
        SELECT
            name,
            primary_skill,
            years_of_experience,
            location,
            skills,
            interests,
            work_preference
        FROM advisor_profiles
        WHERE is_active = 1
    """)

    profiles = cursor.fetchall()

    if not profiles:
        print("❌ No advisor profiles found.")
        conn.close()
        return

    # ---------------------------------------
    # Dataset size
    # ---------------------------------------

    dataset_size = len(profiles)

    # ---------------------------------------
    # Primary Skill Distribution
    # ---------------------------------------

    primary_skills = [
        row[1]
        for row in profiles
        if row[1]
    ]

    primary_skill_distribution = dict(
        Counter(primary_skills)
    )

    # ---------------------------------------
    # Individual Skill Distribution
    # ---------------------------------------

    all_skills = []

    for row in profiles:

        skills = row[4]

        if skills:
            skill_list = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

            all_skills.extend(skill_list)

    skill_distribution = dict(
        Counter(all_skills)
    )

    # ---------------------------------------
    # Location Distribution
    # ---------------------------------------

    locations = [
        row[3]
        for row in profiles
        if row[3]
    ]

    location_distribution = dict(
        Counter(locations)
    )

    # ---------------------------------------
    # Experience
    # ---------------------------------------

    experience = [
        row[2]
        for row in profiles
        if row[2] is not None
    ]

    average_experience = (
        sum(experience) / len(experience)
        if experience
        else 0
    )

    # ---------------------------------------
    # Experience Distribution
    # ---------------------------------------

    experience_distribution = dict(
        Counter(experience)
    )

    # ---------------------------------------
    # Interests Distribution
    # ---------------------------------------

    all_interests = []

    for row in profiles:

        interests = row[5]

        if interests:
            interest_list = [
                interest.strip()
                for interest in interests.split(",")
                if interest.strip()
            ]

            all_interests.extend(interest_list)

    interest_distribution = dict(
        Counter(all_interests)
    )

    # ---------------------------------------
    # Work Preference Distribution
    # ---------------------------------------

    work_preferences = [
        row[6]
        for row in profiles
        if row[6]
    ]

    work_preference_distribution = dict(
        Counter(work_preferences)
    )

    # ---------------------------------------
    # Most Common Skills
    # ---------------------------------------

    most_common_skills = Counter(
        all_skills
    ).most_common(10)

    # ---------------------------------------
    # Most Common Locations
    # ---------------------------------------

    most_common_locations = Counter(
        locations
    ).most_common(10)

    # ---------------------------------------
    # Training Information
    # ---------------------------------------

    training_info = {

        "dataset_size":
            dataset_size,

        "skill_distribution":
            skill_distribution,

        "primary_skill_distribution":
            primary_skill_distribution,

        "location_distribution":
            location_distribution,

        "experience_distribution":
            experience_distribution,

        "average_experience":
            round(average_experience, 2),

        "interest_distribution":
            interest_distribution,

        "work_preference_distribution":
            work_preference_distribution,

        "top_10_skills":
            most_common_skills,

        "top_10_locations":
            most_common_locations,

        "advisor_type":
            "rule_based_matching_with_llm_generation",

        "llm":
            "qwen/qwen3-vl-8b"
    }

    # ---------------------------------------
    # Save Training Data
    # ---------------------------------------

    with open(
        "advisor_training_data.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            training_info,
            file,
            indent=4,
            ensure_ascii=False
        )

    conn.close()

    # ---------------------------------------
    # Output
    # ---------------------------------------

    print("✅ AI Advisor training analysis completed.")
    print(f"✅ Dataset size: {dataset_size}")
    print(
        f"✅ Average experience: "
        f"{round(average_experience, 2)} years"
    )

    print("\n📊 Primary Skills:")
    print(
        json.dumps(
            primary_skill_distribution,
            indent=4
        )
    )

    print("\n📊 Top Skills:")
    print(
        json.dumps(
            most_common_skills,
            indent=4
        )
    )

    print("\n📊 Locations:")
    print(
        json.dumps(
            location_distribution,
            indent=4
        )
    )

    print("\n📊 Work Preferences:")
    print(
        json.dumps(
            work_preference_distribution,
            indent=4
        )
    )


if __name__ == "__main__":
    train_advisor()