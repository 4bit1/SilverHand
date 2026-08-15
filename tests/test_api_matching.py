import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestMatchingAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_get_algorithm_config(self):
        response = self.client.get("/api/matching/config")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("weights", data)
        self.assertEqual(data["weights"]["skill_match_weight"], 0.30)
        self.assertEqual(data["weights"]["location_match_weight"], 0.20)
        self.assertEqual(data["weights"]["fairness_boost_weight"], 0.05)

    def test_parse_customer_query(self):
        payload = {
            "query": "I need a home tutor for Maths in Chennai on Saturday and Sunday morning"
        }
        response = self.client.post("/api/matching/parse-request", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        parsed = data["data"]
        self.assertIn("maths", [s.lower() for s in parsed["required_skills"]])
        self.assertEqual(parsed["location"]["city"], "Chennai")
        self.assertTrue(any(d in ["saturday", "sunday"] for d in parsed["preferred_days"]))

    def test_rank_candidates_endpoint(self):
        payload = {
            "request": {
                "raw_text": "I need someone to teach Carnatic music to my daughter in Chennai",
                "required_skills": ["Carnatic Music"],
                "location": {"city": "Chennai"}
            },
            "providers": [
                {
                    "profile": {
                        "name": "Lakshmi Ammal",
                        "age": 60,
                        "location": {"city": "Chennai"},
                        "skills": [{"name": "Carnatic Music", "experience_years": 20}],
                        "profile_completion_score": 0.95
                    },
                    "trust": {
                        "is_identity_verified": True,
                        "completed_jobs_count": 8,
                        "customer_rating": 4.9,
                        "reviews_count": 8
                    },
                    "engagement": {
                        "response_rate": 0.98,
                        "account_age_days": 15,
                        "is_senior_citizen": True
                    }
                },
                {
                    "profile": {
                        "name": "Ramanathan",
                        "age": 55,
                        "location": {"city": "Delhi"},
                        "skills": [{"name": "Carpentry", "experience_years": 15}],
                        "profile_completion_score": 0.50
                    }
                }
            ],
            "exploration_ratio": 0.20
        }
        response = self.client.post("/api/matching/rank", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_candidates"], 2)
        ranked = data["ranked_providers"]
        self.assertEqual(len(ranked), 2)
        # Top provider should be Lakshmi Ammal with high score
        self.assertEqual(ranked[0]["provider_name"], "Lakshmi Ammal")
        self.assertGreaterEqual(ranked[0]["final_score"], 0.70)
        self.assertIn("skill_match", ranked[0]["breakdown"])

    def test_evaluate_single_candidate(self):
        payload = {
            "request": "Maths tutoring in Chennai",
            "candidate": {
                "name": "Prof. Sundaram",
                "age": 68,
                "location": {"city": "Chennai"},
                "skills": [{"name": "Maths tutoring", "experience_years": 25}],
                "profile_completion_score": 0.85
            }
        }
        response = self.client.post("/api/matching/evaluate-single", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["provider_name"], "Prof. Sundaram")
        self.assertGreaterEqual(data["final_score"], 0.60)
        self.assertIn("breakdown", data)
        self.assertGreaterEqual(data["breakdown"]["experience_score"], 0.90)

if __name__ == "__main__":
    unittest.main()
