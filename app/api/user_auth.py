# Update the user_auth.py with precise authentication
cat > app/models/user_auth.py << 'PYEOF'
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import hashlib
import secrets
import uuid
import logging
import re
import json
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

Base = declarative_base()

class UserAccount(Base):
    __tablename__ = "user_accounts"
    
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    location_city = Column(String(100), nullable=True)
    profile_status = Column(String(50), default="INCOMPLETE")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    def set_password(self, password: str):
        """Hash and set password"""
        salt = secrets.token_hex(16)
        self.password_hash = hashlib.sha256((password + salt).encode()).hexdigest() + ":" + salt
    
    def verify_password(self, password: str) -> bool:
        """Verify password - EXACT match required"""
        if not self.password_hash or ":" not in self.password_hash:
            return False
        hash_part, salt = self.password_hash.split(":", 1)
        input_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return input_hash == hash_part

class UserProfileData(Base):
    __tablename__ = "user_profile_data"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("user_accounts.id"), nullable=False, unique=True)
    summary = Column(String(2000), nullable=True)
    headline = Column(String(255), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    current_role = Column(String(200), nullable=True)
    primary_skill = Column(String(100), nullable=True)
    skills_json = Column(String(4000), default="[]")
    interests_json = Column(String(2000), default="[]")
    achievements_json = Column(String(2000), default="[]")
    education_json = Column(String(2000), default="[]")
    certifications_json = Column(String(2000), default="[]")
    work_history_json = Column(String(4000), default="[]")
    languages_json = Column(String(1000), default="[]")
    preferences_json = Column(String(2000), default="{}")
    profile_completeness = Column(Integer, default=0)
    interview_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserManager:
    def __init__(self, database_url: str = "sqlite:///./elderskill_users.db"):
        self.engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
            echo=False
        )
        self.SessionLocal = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        Base.metadata.create_all(bind=self.engine)
        logger.info("User database initialized")
    
    def get_session(self):
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def create_user(self, email: str, password: str, full_name: str = None, phone: str = None) -> Dict:
        """Create new user with UNIQUE email"""
        with self.get_session() as session:
            # Check if email already exists
            existing_email = session.query(UserAccount).filter(
                UserAccount.email == email.lower()
            ).first()
            
            if existing_email:
                return {"success": False, "error": "EMAIL_EXISTS", "message": "This email is already registered. Please login."}
            
            # Check if phone already exists
            if phone:
                existing_phone = session.query(UserAccount).filter(
                    UserAccount.phone == phone
                ).first()
                if existing_phone:
                    return {"success": False, "error": "PHONE_EXISTS", "message": "This phone number is already registered. Please login."}
            
            # Create new user
            user = UserAccount(
                id=str(uuid.uuid4()),
                email=email.lower(),
                phone=phone,
                full_name=full_name
            )
            user.set_password(password)
            
            session.add(user)
            session.flush()
            
            # Create profile
            profile = UserProfileData(
                id=str(uuid.uuid4()),
                user_id=user.id,
                profile_completeness=0
            )
            session.add(profile)
            
            return {"success": True, "user": self._user_to_dict(user)}
    
    def authenticate_user(self, email: str, password: str) -> Dict:
        """Authenticate with EXACT email and password"""
        with self.get_session() as session:
            # Find user by EXACT email (case-insensitive for email, but password is exact)
            user = session.query(UserAccount).filter(
                UserAccount.email == email.lower().strip()
            ).first()
            
            if not user:
                return {"success": False, "error": "USER_NOT_FOUND", "message": "No account found with this email. Please sign up first."}
            
            # Verify EXACT password
            if not user.verify_password(password):
                return {"success": False, "error": "WRONG_PASSWORD", "message": "Incorrect password. Please try again."}
            
            if not user.is_active:
                return {"success": False, "error": "ACCOUNT_INACTIVE", "message": "This account is inactive. Please contact support."}
            
            # Update last login
            user.last_login_at = datetime.utcnow()
            session.flush()
            
            return {"success": True, "user": self._user_to_dict(user)}
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by exact email"""
        with self.get_session() as session:
            user = session.query(UserAccount).filter(
                UserAccount.email == email.lower().strip()
            ).first()
            if user:
                return self._user_to_dict(user)
            return None
    
    def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Get complete user profile"""
        with self.get_session() as session:
            user = session.query(UserAccount).filter(UserAccount.id == user_id).first()
            profile = session.query(UserProfileData).filter(UserProfileData.user_id == user_id).first()
            
            if not user:
                return None
            
            result = self._user_to_dict(user)
            if profile:
                result["profile"] = self._profile_to_dict(profile)
            
            return result
    
    def update_user_profile(self, user_id: str, data: Dict[str, Any]) -> Dict:
        """Update user profile"""
        with self.get_session() as session:
            profile = session.query(UserProfileData).filter(
                UserProfileData.user_id == user_id
            ).first()
            
            if not profile:
                profile = UserProfileData(
                    id=str(uuid.uuid4()),
                    user_id=user_id
                )
                session.add(profile)
            
            for key, value in data.items():
                if hasattr(profile, key):
                    if isinstance(value, (list, dict)):
                        setattr(profile, key, json.dumps(value))
                    else:
                        setattr(profile, key, value)
            
            profile.updated_at = datetime.utcnow()
            session.flush()
            return self._profile_to_dict(profile)
    
    def _user_to_dict(self, user: UserAccount) -> Dict:
        return {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "full_name": user.full_name,
            "profile_status": user.profile_status,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None
        }
    
    def _profile_to_dict(self, profile: UserProfileData) -> Dict:
        return {
            "summary": profile.summary,
            "headline": profile.headline,
            "years_of_experience": profile.years_of_experience,
            "current_role": profile.current_role,
            "primary_skill": profile.primary_skill,
            "skills": json.loads(profile.skills_json or "[]"),
            "interests": json.loads(profile.interests_json or "[]"),
            "achievements": json.loads(profile.achievements_json or "[]"),
            "education": json.loads(profile.education_json or "[]"),
            "certifications": json.loads(profile.certifications_json or "[]"),
            "work_history": json.loads(profile.work_history_json or "[]"),
            "languages": json.loads(profile.languages_json or "[]"),
            "preferences": json.loads(profile.preferences_json or "{}"),
            "profile_completeness": profile.profile_completeness,
            "interview_count": profile.interview_count
        }

# Singleton
user_manager = UserManager()
PYEOF