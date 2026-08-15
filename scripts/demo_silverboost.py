import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from app.models.profile import UserProfile, Skill, Location, Availability, TeachingExperience
from app.models.matching import (
    CustomerRequest,
    ProviderMatchCandidate,
    ProviderTrustProfile,
    ProviderEngagementProfile,
    AlgorithmWeightsConfig
)
from app.matching import rank_providers

def run_demo():
    print("=" * 80)
    print("  SILVERBOOST — FAIR AI OPPORTUNITY RANKING ENGINE (DEMO)")
    print("=" * 80)
    
    # 1. Define Customer Request
    customer_query = "Home tutor for Class 5 Maths in Chennai on weekends"
    print(f"\n[1] CUSTOMER SEARCH QUERY:")
    print(f"    \"{customer_query}\"\n")
    
    req = CustomerRequest(
        raw_text=customer_query,
        required_skills=["Maths", "Tutoring"],
        location=Location(city="Chennai"),
        preferred_days=["Saturday", "Sunday"],
        preferred_time_slots=["10:00-12:00"]
    )

    # 2. Define Candidates (The Hackathon Case Study)
    candidates = [
        # Person A: Established Maths teacher (100 jobs, 4.8 rating, 5 yrs exp)
        ProviderMatchCandidate(
            profile=UserProfile(
                name="Person A (Maths Teacher)",
                age=50,
                location=Location(city="Chennai"),
                skills=[Skill(name="Maths teacher", experience_years=5)],
                profile_completion_score=0.85,
                availability=Availability(specific_days=["Saturday", "Sunday"], specific_hours="10:00-12:00")
            ),
            trust=ProviderTrustProfile(
                is_identity_verified=True, 
                completed_jobs_count=100, 
                customer_rating=4.8, 
                reviews_count=100
            ),
            engagement=ProviderEngagementProfile(response_rate=0.95, account_age_days=300)
        ),
        
        # Person B: Retired Senior Maths Teacher (32 yrs exp, 2 jobs, senior citizen)
        ProviderMatchCandidate(
            profile=UserProfile(
                name="Person B (Retired Senior Teacher)",
                age=64,
                location=Location(city="Chennai"),
                skills=[Skill(name="Mathematics", experience_years=32, specializations=["Class 5-10 Maths"])],
                teaching_experience=[TeachingExperience(description="Retired school maths teacher for 32 years", student_count=500)],
                profile_completion_score=0.95,
                availability=Availability(specific_days=["Saturday", "Sunday"], specific_hours="10:00-12:00")
            ),
            trust=ProviderTrustProfile(
                is_identity_verified=True, 
                has_profile_verification=True,
                completed_jobs_count=2, 
                reviews_count=2, 
                customer_rating=5.0
            ),
            engagement=ProviderEngagementProfile(
                response_rate=0.98, 
                account_age_days=45, 
                is_senior_citizen=True
            )
        ),
        
        # Person C: Homemaker & Tutor (10 yrs exp, 0 jobs, Day 5 new user)
        ProviderMatchCandidate(
            profile=UserProfile(
                name="Person C (Homemaker & Tutor)",
                age=46,
                location=Location(city="Chennai"),
                skills=[Skill(name="Maths tutoring", experience_years=10)],
                profile_completion_score=0.90,
                availability=Availability(specific_days=["Saturday", "Sunday"], specific_hours="10:00-12:00")
            ),
            trust=ProviderTrustProfile(
                is_identity_verified=True, 
                has_profile_verification=True,
                completed_jobs_count=0, 
                reviews_count=0
            ),
            engagement=ProviderEngagementProfile(
                response_rate=1.0, 
                account_age_days=5, 
                is_homemaker=True
            )
        ),
        
        # Person D: Far away Maths teacher (Nearby city Kanchipuram, 8 yrs exp, 50 jobs)
        ProviderMatchCandidate(
            profile=UserProfile(
                name="Person D (Teacher in Kanchipuram)",
                age=48,
                location=Location(city="Kanchipuram", state="Tamil Nadu"),
                skills=[Skill(name="Maths teacher", experience_years=8)],
                profile_completion_score=0.75,
                availability=Availability(specific_days=["Saturday"], specific_hours="10:00-12:00")
            ),
            trust=ProviderTrustProfile(
                is_identity_verified=True,
                completed_jobs_count=50, 
                customer_rating=4.5, 
                reviews_count=50
            ),
            engagement=ProviderEngagementProfile(response_rate=0.80, account_age_days=200)
        )
    ]

    print("[2] EVALUATING 4 PROVIDER CANDIDATES WITH SILVERBOOST...\n")
    response = rank_providers(req, candidates, exploration_ratio=0.25)

    print(f"Total Candidates: {response.total_candidates} | Exploitation: {response.exploitation_count} | Exploration: {response.exploration_count}")
    print("-" * 80)

    for i, rank in enumerate(response.ranked_providers, 1):
        b = rank.breakdown
        badge = " [* 20% OPPORTUNITY EXPLORATION PICK]" if rank.is_exploration_pick else " [80% BEST MATCH PICK]"
        print(f"\n#{i}: {rank.provider_name}{badge}")
        print(f"    Final Score: {rank.final_score:.4f}")
        print(f"    |-- Skill Match (30%):        {b.skill_match:.2f}")
        print(f"    |-- Location Match (20%):     {b.location_match:.2f}")
        print(f"    |-- Availability Match (15%): {b.availability_match:.2f}")
        print(f"    |-- Trust Score (10%):        {b.trust_score:.2f}")
        print(f"    |-- Profile Quality (10%):    {b.profile_quality:.2f}")
        print(f"    |-- Experience Score (5%):    {b.experience_score:.2f} ({b.raw_experience_years:.0f} yrs)")
        print(f"    |-- Response Rate (5%):       {b.response_rate_score:.2f}")
        print(f"    \\-- Fairness Boost (5%):      {b.fairness_boost:.2f}")
        if rank.boost_reason:
            print(f"    [i] Boost Reason: {rank.boost_reason}")

    print("\n" + "=" * 80)
    print("  KEY TAKEAWAYS:")
    print("  * Person B (Retired teacher, 32 yrs exp) gets high score from experience & skills.")
    print("  * Person C (Homemaker, 0 reviews) receives Opportunity Exploration Boost & is NOT buried.")
    print("  * Person D (Far away) gets lower location score while local options are promoted.")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    run_demo()
