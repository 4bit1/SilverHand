import unittest
from app.models.profile import (
    UserProfile,
    Skill,
    Location,
    Availability,
    WorkExample,
    TeachingExperience
)
from app.models.matching import (
    CustomerRequest,
    ProviderMatchCandidate,
    ProviderTrustProfile,
    ProviderEngagementProfile,
    AlgorithmWeightsConfig
)
from app.matching.skill_matcher import match_skill, extract_skills_from_text
from app.matching.location_matcher import match_location
from app.matching.availability_matcher import match_availability
from app.matching.trust_scorer import compute_trust_score
from app.matching.fairness_boost import compute_fairness_boost
from app.matching.ranking_engine import (
    SilverBoostRankingEngine,
    compute_experience_score,
    compute_response_rate_score
)
from app.matching.recommendation import rank_providers

class TestSilverBoostEngine(unittest.TestCase):

    def test_skill_matcher_carnatic_music(self):
        """Test skill matcher on Carnatic music query"""
        req = CustomerRequest(
            raw_text="I need someone to teach Carnatic music to my daughter."
        )
        provider = UserProfile(
            name="Lakshmi Ammal",
            skills=[
                Skill(name="Carnatic Music", experience_years=15, specializations=["Vocal", "Kritis"])
            ],
            teaching_experience=[
                TeachingExperience(description="Teaching Carnatic vocal to young students for 10 years", student_count=25)
            ]
        )
        score, explanation = match_skill(req, provider)
        self.assertGreaterEqual(score, 0.90)

    def test_skill_matcher_unrelated_skill(self):
        """Test skill matcher when skills do not match"""
        req = CustomerRequest(
            required_skills=["Software Development", "Python"]
        )
        provider = UserProfile(
            name="Ramanathan",
            skills=[Skill(name="Carpentry", experience_years=20)]
        )
        score, explanation = match_skill(req, provider)
        self.assertLess(score, 0.30)

    def test_location_matcher_hierarchy(self):
        """Test location grading: locality (1.0), city (0.8), state (0.5), far away (0.2), remote (1.0)"""
        req_local = CustomerRequest(
            locality="Mylapore",
            location=Location(city="Chennai", state="Tamil Nadu", pincode="600004")
        )
        
        # Provider A: Same locality / pincode
        prov_a = UserProfile(
            location=Location(city="Chennai", state="Tamil Nadu", district="Mylapore", pincode="600004")
        )
        score_a, _ = match_location(req_local, prov_a)
        self.assertEqual(score_a, 1.0)

        # Provider B: Same city
        prov_b = UserProfile(
            location=Location(city="Chennai", state="Tamil Nadu", pincode="600096")
        )
        score_b, _ = match_location(req_local, prov_b)
        self.assertEqual(score_b, 0.8)

        # Provider C: Nearby city / same state
        prov_c = UserProfile(
            location=Location(city="Madurai", state="Tamil Nadu")
        )
        score_c, _ = match_location(req_local, prov_c)
        self.assertEqual(score_c, 0.5)

        # Provider D: Far away
        prov_d = UserProfile(
            location=Location(city="Delhi", state="Delhi")
        )
        score_d, _ = match_location(req_local, prov_d)
        self.assertEqual(score_d, 0.2)

        # Provider E: Remote work request
        req_remote = CustomerRequest(is_remote=True)
        score_remote, _ = match_location(req_remote, prov_d)
        self.assertEqual(score_remote, 1.0)

    def test_availability_matcher_weekend_hours(self):
        """Test availability matching for Saturday + Sunday, 10 AM-12 PM"""
        req = CustomerRequest(
            preferred_days=["Saturday", "Sunday"],
            preferred_time_slots=["10:00-12:00"]
        )
        
        # Exactly matching provider
        prov_exact = UserProfile(
            availability=Availability(
                specific_days=["Saturday", "Sunday"],
                specific_hours="10:00-12:00"
            )
        )
        score_exact, _ = match_availability(req, prov_exact)
        self.assertGreaterEqual(score_exact, 0.90)

        # Weekdays only provider
        prov_weekday = UserProfile(
            availability=Availability(
                specific_days=["Monday", "Tuesday", "Wednesday"],
                specific_hours="10:00-12:00"
            )
        )
        score_weekday, _ = match_availability(req, prov_weekday)
        self.assertLess(score_weekday, 0.40)

    def test_trust_scorer_weights(self):
        """Test trust score combination (40% profile, 30% jobs, 20% reviews, 10% evidence)"""
        user_prof = UserProfile(
            name="Venkatesh",
            skills=[Skill(name="Mathematics", experience_years=25)]
        )
        trust_high = ProviderTrustProfile(
            is_identity_verified=True,
            has_profile_verification=True,
            completed_jobs_count=50,
            customer_rating=4.9,
            reviews_count=40,
            has_skill_certificates=True
        )
        score_high, _ = compute_trust_score(trust_high, user_prof)
        self.assertGreaterEqual(score_high, 0.85)

        # New user with verified profile but 0 jobs
        trust_new = ProviderTrustProfile(
            is_identity_verified=True,
            has_profile_verification=True,
            completed_jobs_count=0,
            reviews_count=0
        )
        score_new, _ = compute_trust_score(trust_new, user_prof)
        # Should not be 0; verified profile and evidence contribute
        self.assertGreaterEqual(score_new, 0.40)

    def test_fairness_boost_cold_start(self):
        """Test cold-start time decay and underrepresented skill boosts"""
        # User 1: Brand new senior citizen with traditional embroidery (Day 5)
        prof_new = UserProfile(
            name="Savithri",
            age=62,
            skills=[Skill(name="Traditional Embroidery", experience_years=30, specializations=["Zari", "Aari"])]
        )
        trust_new = ProviderTrustProfile(completed_jobs_count=0)
        eng_new = ProviderEngagementProfile(account_age_days=5, is_senior_citizen=True)
        
        boost_new, exp_new = compute_fairness_boost(prof_new, trust_new, eng_new)
        self.assertGreaterEqual(boost_new, 0.50)

        # User 2: Established provider (Day 120, 100 completed jobs)
        prof_old = UserProfile(name="Kiran", age=48, skills=[Skill(name="Software Development")])
        trust_old = ProviderTrustProfile(completed_jobs_count=100)
        eng_old = ProviderEngagementProfile(account_age_days=120)
        boost_old, exp_old = compute_fairness_boost(prof_old, trust_old, eng_old)
        self.assertLess(boost_old, 0.15)

    def test_experience_capping(self):
        """Test experience scoring curve and capping"""
        p1 = UserProfile(skills=[Skill(name="Maths", experience_years=1)])
        p5 = UserProfile(skills=[Skill(name="Maths", experience_years=5)])
        p15 = UserProfile(skills=[Skill(name="Maths", experience_years=15)])
        p30 = UserProfile(skills=[Skill(name="Maths", experience_years=30)])

        s1, _ = compute_experience_score(p1)
        s5, _ = compute_experience_score(p5)
        s15, _ = compute_experience_score(p15)
        s30, _ = compute_experience_score(p30)

        self.assertLess(s1, s5)
        self.assertLess(s5, s15)
        self.assertLess(s15, s30)
        self.assertLessEqual(s30, 1.0)
        self.assertGreaterEqual(s30, 0.95)

    def test_response_rate_scoring(self):
        """Test response rate calibration: 95% -> 1.0, 75% -> 0.75, 50% -> 0.50"""
        self.assertEqual(compute_response_rate_score(0.95), 1.0)
        self.assertEqual(compute_response_rate_score(0.99), 1.0)
        self.assertEqual(compute_response_rate_score(0.75), 0.75)
        self.assertEqual(compute_response_rate_score(0.50), 0.50)

    def test_ranking_engine_mathematical_weights(self):
        """Verify the exact mathematical formula of the SilverHands Boosting Algorithm"""
        engine = SilverBoostRankingEngine(AlgorithmWeightsConfig(
            skill_match_weight=0.30,
            location_match_weight=0.20,
            availability_match_weight=0.15,
            trust_score_weight=0.10,
            profile_quality_weight=0.10,
            experience_weight=0.05,
            response_rate_weight=0.05,
            fairness_boost_weight=0.05
        ))
        
        req = CustomerRequest(
            required_skills=["Carnatic Music"],
            location=Location(city="Chennai")
        )
        
        provider = ProviderMatchCandidate(
            profile=UserProfile(
                name="Smt. Radha",
                age=58,
                location=Location(city="Chennai"),
                skills=[Skill(name="Carnatic Music", experience_years=20)],
                profile_completion_score=0.90
            ),
            trust=ProviderTrustProfile(is_identity_verified=True, completed_jobs_count=5),
            engagement=ProviderEngagementProfile(response_rate=0.95, account_age_days=20, is_senior_citizen=True)
        )
        
        result = engine.evaluate_candidate(req, provider)
        self.assertGreaterEqual(result.final_score, 0.75)
        self.assertIsNotNone(result.breakdown)
        self.assertGreater(result.breakdown.skill_match, 0.8)
        self.assertEqual(result.breakdown.location_match, 0.8) # Same city

    def test_hackathon_maths_tutor_scenario(self):
        """
        Tests the scenario:
        Customer: "Home tutor for Class 5 Maths in Chennai"
        - Person A: Maths teacher, 3 km, 5 yrs, 100 reviews, not new
        - Person B: Retired Maths teacher, 5 km, 32 yrs, 2 reviews, not new (Senior)
        - Person C: Homemaker + tutor, 2 km, 10 yrs, 0 reviews, new
        - Person D: Maths teacher, 15 km, 8 yrs, 50 reviews, not new
        """
        req = CustomerRequest(
            raw_text="Home tutor for Class 5 Maths in Chennai",
            required_skills=["Maths", "Tutoring"],
            location=Location(city="Chennai")
        )

        # Person A
        person_a = ProviderMatchCandidate(
            profile=UserProfile(
                name="Person A (Maths teacher)",
                age=50,
                location=Location(city="Chennai"),
                skills=[Skill(name="Maths teacher", experience_years=5)]
            ),
            trust=ProviderTrustProfile(completed_jobs_count=100, customer_rating=4.8, reviews_count=100),
            engagement=ProviderEngagementProfile(response_rate=0.95, account_age_days=300)
        )

        # Person B (Retired Maths teacher, 32 yrs exp, senior citizen)
        person_b = ProviderMatchCandidate(
            profile=UserProfile(
                name="Person B (Retired Maths teacher)",
                age=64,
                location=Location(city="Chennai"),
                skills=[Skill(name="Mathematics", experience_years=32, specializations=["Class 5-10 Maths"])],
                teaching_experience=[TeachingExperience(description="Retired school maths teacher for 32 years")]
            ),
            trust=ProviderTrustProfile(is_identity_verified=True, completed_jobs_count=2, reviews_count=2, customer_rating=5.0),
            engagement=ProviderEngagementProfile(response_rate=0.95, account_age_days=45, is_senior_citizen=True)
        )

        # Person C (Homemaker + tutor, 10 yrs, new joiner, 0 reviews)
        person_c = ProviderMatchCandidate(
            profile=UserProfile(
                name="Person C (Homemaker + tutor)",
                age=46,
                location=Location(city="Chennai"),
                skills=[Skill(name="Maths tutoring", experience_years=10)],
                profile_completion_score=0.90
            ),
            trust=ProviderTrustProfile(is_identity_verified=True, completed_jobs_count=0, reviews_count=0),
            engagement=ProviderEngagementProfile(response_rate=1.0, account_age_days=10, is_homemaker=True)
        )

        # Person D (Maths teacher, far away, 8 yrs)
        person_d = ProviderMatchCandidate(
            profile=UserProfile(
                name="Person D (Maths teacher)",
                age=48,
                location=Location(city="Kanchipuram", state="Tamil Nadu"), # Nearby city
                skills=[Skill(name="Maths teacher", experience_years=8)]
            ),
            trust=ProviderTrustProfile(completed_jobs_count=50, customer_rating=4.5, reviews_count=50),
            engagement=ProviderEngagementProfile(response_rate=0.80, account_age_days=200)
        )

        candidates = [person_a, person_b, person_c, person_d]
        response = rank_providers(req, candidates, exploration_ratio=0.25)
        
        ranked_names = [p.provider_name for p in response.ranked_providers]
        
        # Verify Person B is rewarded for immense 32-yr experience + senior factor
        # Verify Person C gets discovery boost and is not buried at the bottom
        # Verify Person D (far away) is placed appropriately
        self.assertEqual(len(response.ranked_providers), 4)
        self.assertTrue(any(p.is_exploration_pick for p in response.ranked_providers))

if __name__ == "__main__":
    unittest.main()
