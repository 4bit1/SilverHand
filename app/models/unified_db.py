
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from contextlib import contextmanager
from datetime import datetime
import hashlib
import secrets
import uuid
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    
    def set_password(self, password: str):
        salt = secrets.token_hex(16)
        self.password_hash = hashlib.sha256((password + salt).encode()).hexdigest() + ":" + salt
    
    def verify_password(self, password: str) -> bool:
        if not self.password_hash or ":" not in self.password_hash:
            return False
        hash_part, salt = self.password_hash.split(":", 1)
        return hashlib.sha256((password + salt).encode()).hexdigest() == hash_part

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    summary = Column(Text, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    primary_skill = Column(String(100), nullable=True)
    location_city = Column(String(100), nullable=True)
    profile_completeness = Column(Integer, default=0)
    interview_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    years_of_experience = Column(Integer, nullable=True)
    is_primary = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="skills")

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="ACTIVE")
    language = Column(String(10), default="en-IN")
    progress_percentage = Column(Float, default=0.0)
    questions_answered = Column(Integer, default=0)
    total_questions = Column(Integer, default=8)
    summary_generated = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="interviews")

class Question(Base):
    __tablename__ = "questions"
    id = Column(String(36), primary_key=True)
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_number = Column(Integer, nullable=False)
    
    interview = relationship("Interview", back_populates="questions")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(String(36), primary_key=True)
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False)
    transcript = Column(Text, nullable=False)
    input_type = Column(String(20), default="voice")
    asr_provider = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    interview = relationship("Interview", back_populates="answers")

# Add relationships
User.interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
Interview.questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
Interview.answers = relationship("Answer", back_populates="interview", cascade="all, delete-orphan")
Question.answer = relationship("Answer", back_populates="question", uselist=False)
Answer.question = relationship("Question", back_populates="answer")

class UnifiedDatabase:
    def __init__(self, database_url: str = None):
        import os
        self.database_url = database_url or os.getenv("DATABASE_URL", "sqlite:///./elderskill.db")
        self.engine = create_engine(
            self.database_url,
            connect_args={"check_same_thread": False} if "sqlite" in self.database_url else {},
            echo=False
        )
        self.SessionLocal = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        Base.metadata.create_all(bind=self.engine)
        logger.info(f"✅ Database ready: {self.database_url}")
    
    @contextmanager
    def get_session(self):
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"DB Error: {e}")
            raise
        finally:
            session.close()
    
    def create_user(self, email: str, password: str, full_name: str = None) -> Dict:
        with self.get_session() as session:
            existing = session.query(User).filter(User.email == email.lower().strip()).first()
            if existing:
                return {"success": False, "error": "EMAIL_EXISTS", "message": "This email is already registered."}
            
            user = User(id=str(uuid.uuid4()), email=email.lower().strip(), full_name=full_name)
            user.set_password(password)
            session.add(user)
            session.flush()
            
            profile = Profile(id=str(uuid.uuid4()), user_id=user.id)
            session.add(profile)
            session.flush()
            
            logger.info(f"✅ User created: {email}")
            return {"success": True, "user": self._user_dict(user)}
    
    def authenticate_user(self, email: str, password: str) -> Dict:
        with self.get_session() as session:
            user = session.query(User).filter(User.email == email.lower().strip()).first()
            if not user:
                return {"success": False, "error": "USER_NOT_FOUND", "message": "No account found."}
            if not user.verify_password(password):
                return {"success": False, "error": "WRONG_PASSWORD", "message": "Incorrect password."}
            user.last_login_at = datetime.utcnow()
            session.flush()
            return {"success": True, "user": self._user_dict(user)}
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        with self.get_session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            result = self._user_dict(user)
            profile = session.query(Profile).filter(Profile.user_id == user_id).first()
            if profile:
                result["profile"] = self._profile_dict(profile)
            skills = session.query(Skill).filter(Skill.user_id == user_id).all()
            result["skills"] = [{"skill_name": s.skill_name, "years": s.years_of_experience} for s in skills]
            return result
    
    def update_profile(self, user_id: str, data: Dict) -> Dict:
        with self.get_session() as session:
            profile = session.query(Profile).filter(Profile.user_id == user_id).first()
            if not profile:
                profile = Profile(id=str(uuid.uuid4()), user_id=user_id)
                session.add(profile)
            for key, value in data.items():
                if hasattr(profile, key):
                    setattr(profile, key, value)
            filled = sum(1 for v in [profile.summary, profile.years_of_experience, profile.primary_skill, profile.location_city] if v)
            profile.profile_completeness = int((filled / 4) * 100)
            session.flush()
            return self._profile_dict(profile)
    
    def add_skill(self, user_id: str, skill_name: str, years: int = None) -> Dict:
        with self.get_session() as session:
            skill = session.query(Skill).filter(Skill.user_id == user_id, Skill.skill_name == skill_name.lower()).first()
            if skill:
                if years: skill.years_of_experience = years
            else:
                skill = Skill(id=str(uuid.uuid4()), user_id=user_id, skill_name=skill_name.lower(), years_of_experience=years)
                session.add(skill)
            session.flush()
            return {"skill_name": skill.skill_name, "years": skill.years_of_experience}
    
    def create_interview(self, user_id: str, language: str = "en-IN") -> Dict:
        with self.get_session() as session:
            interview = Interview(id=str(uuid.uuid4()), user_id=user_id, language=language, status="ACTIVE")
            session.add(interview)
            session.flush()
            return {"id": interview.id}
    
    def save_question(self, interview_id: str, text: str, number: int) -> Dict:
        with self.get_session() as session:
            q = Question(id=str(uuid.uuid4()), interview_id=interview_id, question_text=text, question_number=number)
            session.add(q)
            session.flush()
            return {"id": q.id}
    
    def save_answer(self, interview_id: str, question_id: str, transcript: str, input_type: str = "voice", asr_provider: str = None) -> Dict:
        with self.get_session() as session:
            a = Answer(id=str(uuid.uuid4()), interview_id=interview_id, question_id=question_id, transcript=transcript, input_type=input_type, asr_provider=asr_provider)
            session.add(a)
            session.flush()
            interview = session.query(Interview).filter(Interview.id == interview_id).first()
            if interview:
                interview.questions_answered += 1
                interview.progress_percentage = interview.questions_answered / interview.total_questions * 100
            session.flush()
            return {"id": a.id}
    
    def complete_interview(self, interview_id: str, summary: str) -> Dict:
        with self.get_session() as session:
            interview = session.query(Interview).filter(Interview.id == interview_id).first()
            if interview:
                interview.status = "COMPLETED"
                interview.completed_at = datetime.utcnow()
                interview.progress_percentage = 100.0
                interview.summary_generated = summary
                session.flush()
                profile = session.query(Profile).filter(Profile.user_id == interview.user_id).first()
                if profile:
                    profile.summary = summary
                    profile.interview_count += 1
                    profile.profile_completeness = 100
                    session.flush()
            return {"success": True}
    
    def _user_dict(self, user: User) -> Dict:
        return {"id": user.id, "email": user.email, "full_name": user.full_name}
    
    def _profile_dict(self, profile: Profile) -> Dict:
        return {
            "summary": profile.summary,
            "years_of_experience": profile.years_of_experience,
            "primary_skill": profile.primary_skill,
            "location_city": profile.location_city,
            "profile_completeness": profile.profile_completeness,
            "interview_count": profile.interview_count
        }

db = UnifiedDatabase()

