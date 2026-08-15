import sqlite3
import uuid
import random
from datetime import datetime

DB_PATH = "elderskill.db"

FIRST_NAMES = [
    "Arun", "Priya", "Rajesh", "Meera", "Karthik",
    "Deepa", "Rahul", "Lakshmi", "Suresh", "Anitha",
    "Vijay", "Divya", "Mohan", "Kavya", "Ravi",
    "Swetha", "Prakash", "Nandhini", "Ajay", "Revathi"
]

LAST_NAMES = [
    "Kumar", "Sharma", "Ramesh", "Krishnan", "Nair",
    "Iyer", "Reddy", "Menon", "Patel", "Singh"
]

SKILL_GROUPS = {
    "Python Development": [
        "Python", "Django", "FastAPI", "SQL", "AWS"
    ],
    "Java Development": [
        "Java", "Spring Boot", "SQL", "Microservices", "Docker"
    ],
    "Web Development": [
        "JavaScript", "React", "Node.js", "MongoDB", "CSS"
    ],
    "Machine Learning": [
        "Python", "Machine Learning", "TensorFlow", "PyTorch", "NLP"
    ],
    "Data Science": [
        "Python", "SQL", "Statistics", "Pandas", "Tableau"
    ],
    "Cloud Computing": [
        "AWS", "Azure", "Docker", "Kubernetes", "Terraform"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"
    ],
    "UI/UX Design": [
        "Figma", "UI Design", "UX Research", "Prototyping", "Adobe XD"
    ],
    "Digital Marketing": [
        "SEO", "Social Media", "Google Ads", "Content Marketing", "Analytics"
    ],
    "Teaching": [
        "Teaching", "Mentoring", "Communication", "Training", "Leadership"
    ],
    "Tailoring": [
        "Tailoring", "Sewing", "Embroidery", "Fashion Design", "Alterations"
    ],
    "Carpentry": [
        "Carpentry", "Furniture Making", "Woodworking", "Interior Work"
    ],
    "Electrical Work": [
        "Electrical Wiring", "Maintenance", "Repair", "Installation"
    ],
    "Farming": [
        "Organic Farming", "Crop Management", "Irrigation", "Agriculture"
    ],
    "Cooking": [
        "Cooking", "Baking", "Catering", "Food Preparation"
    ]
}

LOCATIONS = [
    "Chennai",
    "Bangalore",
    "Mumbai",
    "Hyderabad",
    "Delhi",
    "Pune",
    "Kolkata",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Kochi",
    "Ahmedabad"
]

WORK_PREFERENCES = [
    "Full-time",
    "Part-time",
    "Remote",
    "Hybrid",
    "Freelance",
    "Consulting",
    "Flexible work"
]

INTERESTS = [
    "Teaching",
    "Mentoring",
    "Problem solving",
    "Technology",
    "Entrepreneurship",
    "Consulting",
    "Innovation",
    "Working with people"
]


def create_tables(conn):

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS advisor_profiles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            primary_skill TEXT,
            years_of_experience INTEGER,
            location TEXT,
            skills TEXT,
            interests TEXT,
            work_preference TEXT,
            summary TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TEXT
        )
    """)

    conn.commit()


def generate_profile(index):

    group = random.choice(list(SKILL_GROUPS.keys()))

    skills = SKILL_GROUPS[group]

    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)

    name = f"{first} {last}"

    years = random.randint(3, 30)

    location = random.choice(LOCATIONS)

    selected_skills = random.sample(
        skills,
        min(len(skills), random.randint(3, len(skills)))
    )

    interests = random.sample(
        INTERESTS,
        random.randint(1, 3)
    )

    preference = random.choice(WORK_PREFERENCES)

    summary = (
        f"{name} is an experienced professional with "
        f"{years} years of experience in {group}. "
        f"Their key skills include {', '.join(selected_skills)}. "
        f"They are based in {location} and are interested in "
        f"{', '.join(interests)}. "
        f"They prefer {preference.lower()} opportunities."
    )

    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": f"user{index}@demo.elderskill.com",
        "primary_skill": group,
        "years": years,
        "location": location,
        "skills": ", ".join(selected_skills),
        "interests": ", ".join(interests),
        "preference": preference,
        "summary": summary
    }


def seed_data():

    conn = sqlite3.connect(DB_PATH)

    create_tables(conn)

    cursor = conn.cursor()

    # Clear previous advisor data
    cursor.execute("DELETE FROM advisor_profiles")

    profiles = []

    for i in range(1, 101):

        profile = generate_profile(i)

        cursor.execute("""
            INSERT INTO advisor_profiles (
                id,
                name,
                email,
                primary_skill,
                years_of_experience,
                location,
                skills,
                interests,
                work_preference,
                summary,
                is_active,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            profile["id"],
            profile["name"],
            profile["email"],
            profile["primary_skill"],
            profile["years"],
            profile["location"],
            profile["skills"],
            profile["interests"],
            profile["preference"],
            profile["summary"],
            1,
            datetime.utcnow().isoformat()
        ))

        profiles.append(profile)

    conn.commit()

    count = cursor.execute(
        "SELECT COUNT(*) FROM advisor_profiles"
    ).fetchone()[0]

    conn.close()

    print(f"✅ Created {count} advisor profiles")


if __name__ == "__main__":
    seed_data()