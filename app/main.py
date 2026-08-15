from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, Response
from pydantic import BaseModel
import numpy as np
import logging
import uuid
from typing import Optional, Dict, List
import re
import os
import subprocess
import wave
import httpx
import base64
import hashlib
import secrets
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from contextlib import contextmanager

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ DATABASE ============
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    
    def set_password(self, pw):
        salt = secrets.token_hex(16)
        self.password_hash = hashlib.sha256((pw + salt).encode()).hexdigest() + ":" + salt
    
    def verify_password(self, pw):
        if ":" not in self.password_hash: return False
        h, salt = self.password_hash.split(":", 1)
        return hashlib.sha256((pw + salt).encode()).hexdigest() == h

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True)
    summary = Column(Text)
    years_of_experience = Column(Integer)
    primary_skill = Column(String(100))
    location_city = Column(String(100))
    profile_completeness = Column(Integer, default=0)
    interview_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    years_of_experience = Column(Integer)

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="ACTIVE")
    progress_percentage = Column(Float, default=0.0)
    questions_answered = Column(Integer, default=0)
    summary_generated = Column(Text)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    user = relationship("User", back_populates="interviews")

class Question(Base):
    __tablename__ = "questions"
    id = Column(String(36), primary_key=True)
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_number = Column(Integer, nullable=False)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(String(36), primary_key=True)
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False)
    transcript = Column(Text, nullable=False)
    input_type = Column(String(20), default="voice")
    asr_provider = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

engine = create_engine("sqlite:///./elderskill.db", connect_args={"check_same_thread": False})
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)

@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    finally:
        db.close()

# ============ APP ============
app = FastAPI(title="ElderSkill")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sarvam_asr = None
whisper_model = None
sessions = {}
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "").strip()
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://creamlike-flashbulb-roman.ngrok-free.dev/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen/qwen2.5-72b-instruct")

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TTSRequest(BaseModel):
    text: str
    language: str = "en-IN"

class InterviewStartRequest(BaseModel):
    user_id: str
    language: str = "en"

@app.on_event("startup")
async def startup():
    global sarvam_asr, whisper_model
    
    if SARVAM_API_KEY and "your" not in SARVAM_API_KEY.lower():
        try:
            from app.asr.sarvam_asr import SarvamASR
            sarvam_asr = SarvamASR(api_key=SARVAM_API_KEY, model="saaras:v3")
            logger.info("✅ Sarvam ASR ready")
        except Exception as e:
            logger.error(f"Sarvam: {e}")
    
    try:
        import whisper
        whisper_model = whisper.load_model("base", device="cpu")
        logger.info("✅ Whisper ready")
    except:
        pass

# ============ PAGES ============
@app.get("/", response_class=HTMLResponse)
async def root():
    return Path("app/templates/index.html").read_text()

@app.get("/auth", response_class=HTMLResponse)
async def auth_page():
    return Path("app/templates/auth.html").read_text()

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard():
    return Path("app/templates/dashboard.html").read_text()

@app.get("/health")
async def health():
    return {"status": "ok", "sarvam": sarvam_asr is not None}

# ============ AUTH ============
@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    email = request.email.lower().strip()
    
    with get_db() as db:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return JSONResponse(status_code=409, content={"success": False, "error": {"message": "Email already exists. Please login."}})
        
        user = User(id=str(uuid.uuid4()), email=email, full_name=request.full_name)
        user.set_password(request.password)
        db.add(user)
        db.flush()
        
        profile = Profile(id=str(uuid.uuid4()), user_id=user.id)
        db.add(profile)
        
        logger.info(f"✅ User created: {email}")
        return {"success": True, "data": {"user": {"id": user.id, "email": email, "full_name": request.full_name}}}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    email = request.email.lower().strip()
    
    with get_db() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return JSONResponse(status_code=404, content={"success": False, "error": {"message": "No account found."}})
        if not user.verify_password(request.password):
            return JSONResponse(status_code=401, content={"success": False, "error": {"message": "Incorrect password."}})
        
        return {"success": True, "data": {"user": {"id": user.id, "email": email, "full_name": user.full_name}}}

@app.get("/api/auth/users/{user_id}")
async def get_user(user_id: str):
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"success": False, "error": {"message": "User not found"}})
        
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        skills = db.query(Skill).filter(Skill.user_id == user_id).all()
        
        return {
            "success": True,
            "data": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "profile": {
                    "summary": profile.summary if profile else None,
                    "years_of_experience": profile.years_of_experience if profile else None,
                    "primary_skill": profile.primary_skill if profile else None,
                    "location_city": profile.location_city if profile else None,
                    "profile_completeness": profile.profile_completeness if profile else 0,
                    "interview_count": profile.interview_count if profile else 0
                },
                "skills": [{"skill_name": s.skill_name, "years": s.years_of_experience} for s in skills]
            }
        }

# ============ TTS ============
@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    if not SARVAM_API_KEY or "your" in SARVAM_API_KEY.lower():
        return JSONResponse(status_code=400, content={"success": False, "error": "No valid Sarvam API key"})
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.sarvam.ai/text-to-speech",
                headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
                json={
                    "inputs": [request.text],
                    "target_language_code": "en-IN",
                    "speaker": "anushka",
                    "model": "bulbul:v2",
                    "pitch": 0.0,
                    "pace": 0.95,
                    "loudness": 1.2
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "audios" in result and result["audios"]:
                    audio_bytes = base64.b64decode(result["audios"][0])
                    return Response(content=audio_bytes, media_type="audio/wav")
            
            return JSONResponse(status_code=400, content={"success": False, "error": response.text[:200]})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

# ============ INTERVIEW ============
@app.post("/api/interviews/start")
async def start_interview(request: InterviewStartRequest):
    with get_db() as db:
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"success": False, "error": {"message": "User not found. Please sign up at /auth"}})
        
        interview = Interview(id=str(uuid.uuid4()), user_id=user.id, status="ACTIVE")
        db.add(interview)
        db.flush()
        db_interview_id = interview.id
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "user_id": request.user_id,
        "db_interview_id": db_interview_id,
        "current_question": "What is the one skill you are best known for?",
        "question_number": 0,
        "progress": 0,
        "all_answers": [],
        "transcript_data": [],
        "profile": {}
    }
    
    return {"success": True, "data": {"session_id": session_id, "question": sessions[session_id]["current_question"]}}

@app.post("/api/interviews/{session_id}/answer")
async def submit_answer(session_id: str, request: Request):
    if session_id not in sessions:
        return JSONResponse(status_code=404, content={"success": False, "error": {"message": "Session not found"}})
    
    session = sessions[session_id]
    transcript = ""
    asr_used = "none"
    
    try:
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            body = await request.json()
            transcript = body.get("text_answer", "").strip()
            asr_used = "text"
        elif "multipart/form-data" in content_type:
            form = await request.form()
            if "audio" in form:
                audio_file = form["audio"]
                audio_bytes = await audio_file.read()
                
                temp_webm = f"/tmp/a_{session_id}.webm"
                with open(temp_webm, 'wb') as f:
                    f.write(audio_bytes)
                
                temp_wav = f"/tmp/a_{session_id}.wav"
                subprocess.run(['ffmpeg', '-y', '-i', temp_webm, '-ar', '16000', '-ac', '1', '-sample_fmt', 's16', temp_wav], capture_output=True)
                
                if os.path.exists(temp_wav):
                    with wave.open(temp_wav, 'rb') as wf:
                        audio_np = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
                    
                    if sarvam_asr:
                        try:
                            result = sarvam_asr.transcribe(audio_np, "en")
                            if result.text.strip():
                                transcript = result.text.strip()
                                asr_used = "sarvam"
                        except: pass
                    
                    if not transcript and whisper_model:
                        result = whisper_model.transcribe(audio_np, fp16=False)
                        transcript = result["text"].strip()
                        asr_used = "whisper"
                    
                    os.unlink(temp_webm)
                    os.unlink(temp_wav)
        
        if not transcript:
            return JSONResponse(content={"success": False, "error": {"message": "Couldn't understand. Try again."}})
        
        session["transcript_data"].append({"question": session["current_question"], "answer": transcript})
        session["all_answers"].append(transcript)
        
        updates = extract_info(transcript, session["profile"])
        for u in updates:
            session["profile"][u["field"]] = u["value"]
        
        with get_db() as db:
            q = Question(id=str(uuid.uuid4()), interview_id=session["db_interview_id"], question_text=session["current_question"], question_number=session["question_number"] + 1)
            db.add(q)
            db.flush()
            
            a = Answer(id=str(uuid.uuid4()), interview_id=session["db_interview_id"], question_id=q.id, transcript=transcript, input_type="voice" if "audio" in content_type else "text", asr_provider=asr_used)
            db.add(a)
            
            if session["profile"].get("skill"):
                skill = Skill(id=str(uuid.uuid4()), user_id=session["user_id"], skill_name=session["profile"]["skill"])
                db.add(skill)
            
            profile = db.query(Profile).filter(Profile.user_id == session["user_id"]).first()
            if profile:
                if session["profile"].get("skill"): profile.primary_skill = session["profile"]["skill"]
                if session["profile"].get("experience_years"): profile.years_of_experience = session["profile"]["experience_years"]
                profile.profile_completeness = min(100, profile.profile_completeness + 12)
        
        session["question_number"] += 1
        session["progress"] = session["question_number"] / 8
        
        if session["question_number"] >= 8:
            summary = None
            try:
                summary = await generate_ai_summary(session["transcript_data"], session["profile"])
            except:
                pass
            if not summary:
                summary = generate_summary(session["profile"], session["all_answers"])
            
            with get_db() as db:
                interview = db.query(Interview).filter(Interview.id == session["db_interview_id"]).first()
                if interview:
                    interview.status = "COMPLETED"
                    interview.completed_at = datetime.utcnow()
                    interview.progress_percentage = 100
                    interview.summary_generated = summary
                
                profile = db.query(Profile).filter(Profile.user_id == session["user_id"]).first()
                if profile:
                    profile.summary = summary
                    profile.profile_completeness = 100
                    profile.interview_count += 1
            
            return {"success": True, "data": {"transcript": transcript, "completed": True, "progress": 1.0, "summary": summary}}
        
        next_q = get_next_question(session)
        session["current_question"] = next_q
        return {"success": True, "data": {"transcript": transcript, "next_question": next_q, "progress": session["progress"], "completed": False}}
        
    except Exception as e:
        logger.error(f"Error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": {"message": str(e)}})

def extract_info(transcript, profile):
    updates = []
    t = transcript.lower()
    m = re.search(r'(\d+)\s*(?:years?|yrs?)', t)
    if m: updates.append({"field": "experience_years", "value": int(m.group(1))})
    for skill in ["machine learning", "software", "python", "java", "tailoring", "teaching", "cooking", "programming"]:
        if skill in t:
            updates.append({"field": "skill", "value": skill})
            break
    for city in ["chennai", "mumbai", "delhi", "bangalore", "kolkata", "hyderabad"]:
        if city in t:
            updates.append({"field": "location", "value": city.title()})
            break
    return updates

async def generate_ai_summary(transcript_data, profile):
    """Generate human-engaging summary using Qwen LLM"""
    conversation = ""
    for item in transcript_data:
        conversation += f"Q: {item['question']}\nA: {item['answer']}\n\n"
    
    prompt = f"""You are an expert career profile writer for ElderSkill.

Based on this interview transcript, create a compelling, professional, human-engaging profile summary.

INTERVIEW TRANSCRIPT:
{conversation}

EXTRACTED DATA:
{json.dumps(profile, indent=2)}

INSTRUCTIONS:
1. Write in a natural, warm, human tone
2. Focus on actual skills, experience, and passion
3. Include specific details from answers
4. Use employer-searchable keywords
5. 100-150 words
6. Do NOT invent information
7. No generic AI phrases
8. Write as a skilled human recruiter

Return ONLY the summary paragraph."""
    
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{LLM_BASE_URL}/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": LLM_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are an expert career profile writer."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 400,
                    "temperature": 0.7
                }
            )
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and result["choices"]:
                    return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        logger.error(f"LLM failed: {e}")
    return None

async def generate_ai_summary(transcript_data, profile):
    """Generate human-engaging summary using Qwen LLM via ngrok"""
    
    conversation = ""
    for item in transcript_data:
        conversation += f"Q: {item['question']}\nA: {item['answer']}\n\n"
    
    prompt = f"""You are an expert career profile writer for ElderSkill, a platform connecting experienced professionals with opportunities.

Based on the following voice interview transcript, create a compelling, professional, and human-engaging profile summary.

INTERVIEW TRANSCRIPT:
{conversation}

EXTRACTED PROFILE DATA:
{json.dumps(profile, indent=2)}

INSTRUCTIONS:
1. Write in a natural, warm, human tone (NOT AI-sounding)
2. Focus on their actual skills, experience, and passion mentioned in the transcript
3. Include specific details from their answers
4. Use employer-searchable keywords naturally (Python, Java, cloud computing, machine learning, etc.)
5. Length: 100-150 words
6. Do NOT invent information not in the transcript
7. Do NOT use phrases like "seasoned professional" or "dedicated to delivering"
8. Write as a skilled human recruiter describing this person
9. Highlight what makes them unique and valuable
10. Make it engaging, descriptive, and memorable

Return ONLY the summary paragraph. No markdown, no bullet points."""

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{LLM_BASE_URL}/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": LLM_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are an expert career profile writer for ElderSkill."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 500,
                    "temperature": 0.7,
                    "stream": False
                }
            )
            
            logger.info(f"LLM response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    summary = result["choices"][0]["message"]["content"].strip()
                    logger.info(f"✅ AI Summary generated: {summary[:100]}...")
                    return summary
            else:
                logger.error(f"LLM error: {response.status_code} - {response.text[:200]}")
                
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
    
    return None

def generate_summary(profile, all_answers):
    """Fallback summary if LLM fails"""
    parts = []
    if profile.get("skill"): parts.append(f"Skilled in {profile['skill']}")
    if profile.get("experience_years"): parts.append(f"with {profile['experience_years']} years experience")
    if profile.get("location"): parts.append(f"based in {profile['location']}")
    return " ".join(parts) + "." if parts else "Profile created."

def get_next_question(session):
    questions = [
        "What kind of work have you been doing?",
        "How many years of experience do you have?",
        "What do you enjoy about your work?",
        "Have you taught others?",
        "Where are you located?",
        "What are your work preferences?",
        "Anything else to share?"
    ]
    return questions[min(session["question_number"] - 1, len(questions) - 1)]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
