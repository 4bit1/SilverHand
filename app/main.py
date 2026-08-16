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
import asyncio
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

app = FastAPI(title="ElderSkill")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

sarvam_asr = None
whisper_model = None
sessions = {}
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "").strip()
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://creamlike-flashbulb-roman.ngrok-free.dev/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen/qwen3-vl-8b")

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
            logger.info("✅ Sarvam ready")
        except Exception as e:
            logger.error(f"Sarvam: {e}")
    try:
        import whisper
        whisper_model = whisper.load_model("base", device="cpu")
        logger.info("✅ Whisper ready")
    except: pass

@app.get("/", response_class=HTMLResponse)
async def root(): return Path("app/templates/index.html").read_text()

@app.get("/auth", response_class=HTMLResponse)
async def auth_page(): return Path("app/templates/auth.html").read_text()

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(): return Path("app/templates/dashboard.html").read_text()

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    email = request.email.lower().strip()
    with get_db() as db:
        if db.query(User).filter(User.email == email).first():
            return JSONResponse(status_code=409, content={"success": False, "error": {"message": "Email exists"}})
        user = User(id=str(uuid.uuid4()), email=email, full_name=request.full_name)
        user.set_password(request.password)
        db.add(user)
        db.flush()
        db.add(Profile(id=str(uuid.uuid4()), user_id=user.id))
        return {"success": True, "data": {"user": {"id": user.id, "email": email, "full_name": request.full_name}}}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    email = request.email.lower().strip()
    with get_db() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user: return JSONResponse(status_code=404, content={"success": False, "error": {"message": "No account"}})
        if not user.verify_password(request.password): return JSONResponse(status_code=401, content={"success": False, "error": {"message": "Wrong password"}})
        return {"success": True, "data": {"user": {"id": user.id, "email": email, "full_name": user.full_name}}}

@app.get("/api/auth/users/{user_id}")
async def get_user(user_id: str):
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user: return JSONResponse(status_code=404, content={"success": False})
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        skills = db.query(Skill).filter(Skill.user_id == user_id).all()
        return {"success": True, "data": {
            "id": user.id, "email": user.email, "full_name": user.full_name,
            "profile": {"summary": profile.summary if profile else None, "years_of_experience": profile.years_of_experience if profile else None, "primary_skill": profile.primary_skill if profile else None, "location_city": profile.location_city if profile else None, "profile_completeness": profile.profile_completeness if profile else 0, "interview_count": profile.interview_count if profile else 0},
            "skills": [{"skill_name": s.skill_name} for s in skills]
        }}

@app.post("/api/tts")
async def tts(request: TTSRequest):
    if not SARVAM_API_KEY or "your" in SARVAM_API_KEY.lower():
        return JSONResponse(status_code=400, content={"error": "No API key"})
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post("https://api.sarvam.ai/text-to-speech",
                headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
                json={"inputs": [request.text], "target_language_code": "en-IN", "speaker": "anushka", "model": "bulbul:v2", "loudness": 1.2})
            if r.status_code == 200:
                result = r.json()
                if "audios" in result:
                    return Response(content=base64.b64decode(result["audios"][0]), media_type="audio/wav")
    except Exception as e:
        logger.error(f"TTS: {e}")
    return JSONResponse(status_code=500, content={"error": "TTS failed"})

@app.post("/api/interviews/start")
async def start_interview(request: InterviewStartRequest):
    with get_db() as db:
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"success": False, "error": {"message": "User not found. Sign up at /auth"}})
        interview = Interview(id=str(uuid.uuid4()), user_id=user.id, status="ACTIVE")
        db.add(interview)
        db.flush()
        db_interview_id = interview.id
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "user_id": request.user_id, "db_interview_id": db_interview_id,
        "current_question": "What is the one skill you are best known for?",
        "question_number": 0, "progress": 0, "all_answers": [], "transcript_data": [], "profile": {}
    }
    return {"success": True, "data": {"session_id": session_id, "question": sessions[session_id]["current_question"]}}

@app.post("/api/interviews/{session_id}/answer")
async def submit_answer(session_id: str, request: Request):
    if session_id not in sessions:
        return JSONResponse(status_code=404, content={"success": False})
    
    session = sessions[session_id]
    transcript = ""
    
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            body = await request.json()
            transcript = body.get("text_answer", "").strip()
        elif "multipart/form-data" in content_type:
            form = await request.form()
            if "audio" in form:
                audio_file = form["audio"]
                audio_bytes = await audio_file.read()
                temp_webm = f"/tmp/a_{session_id}.webm"
                with open(temp_webm, 'wb') as f: f.write(audio_bytes)
                temp_wav = f"/tmp/a_{session_id}.wav"
                subprocess.run(['ffmpeg','-y','-i',temp_webm,'-ar','16000','-ac','1','-sample_fmt','s16',temp_wav], capture_output=True)
                if os.path.exists(temp_wav):
                    with wave.open(temp_wav, 'rb') as wf:
                        audio_np = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
                    if sarvam_asr:
                        try:
                            r = sarvam_asr.transcribe(audio_np, "en")
                            if r.text.strip(): transcript = r.text.strip()
                        except: pass
                    if not transcript and whisper_model:
                        transcript = whisper_model.transcribe(audio_np, fp16=False)["text"].strip()
                    os.unlink(temp_webm); os.unlink(temp_wav)
        
        if not transcript:
            return JSONResponse(content={"success": False, "error": {"message": "Couldn't understand"}})
        
        session["transcript_data"].append({"question": session["current_question"], "answer": transcript})
        session["all_answers"].append(transcript)
        
        # IMPROVED extraction
        updates = extract_info(transcript, session["profile"])
        for u in updates: session["profile"][u["field"]] = u["value"]
        
        # Save to DB
        with get_db() as db:
            q = Question(id=str(uuid.uuid4()), interview_id=session["db_interview_id"], question_text=session["current_question"], question_number=session["question_number"]+1)
            db.add(q); db.flush()
            db.add(Answer(id=str(uuid.uuid4()), interview_id=session["db_interview_id"], question_id=q.id, transcript=transcript, input_type="voice" if "audio" in content_type else "text"))
            if session["profile"].get("skill"):
                db.add(Skill(id=str(uuid.uuid4()), user_id=session["user_id"], skill_name=session["profile"]["skill"]))
            profile = db.query(Profile).filter(Profile.user_id == session["user_id"]).first()
            if profile:
                if session["profile"].get("skill"): profile.primary_skill = session["profile"]["skill"]
                if session["profile"].get("experience_years"): profile.years_of_experience = session["profile"]["experience_years"]
                if session["profile"].get("location"): profile.location_city = session["profile"]["location"]
                profile.profile_completeness = min(100, profile.profile_completeness + 12)
        
        session["question_number"] += 1
        session["progress"] = session["question_number"] / 8
        
        if session["question_number"] >= 8:
            # GENERATE AI SUMMARY
            logger.info("🎯 Generating AI summary...")
            summary = await generate_ai_summary(session["transcript_data"], session["profile"])
            if not summary:
                summary = f"Professional with experience in {session['profile'].get('skill', 'various fields')}"
            
            # Save summary
            with get_db() as db:
                interview = db.query(Interview).filter(Interview.id == session["db_interview_id"]).first()
                if interview:
                    interview.status = "COMPLETED"; interview.completed_at = datetime.utcnow()
                    interview.progress_percentage = 100; interview.summary_generated = summary
                profile = db.query(Profile).filter(Profile.user_id == session["user_id"]).first()
                if profile:
                    profile.summary = summary; profile.profile_completeness = 100; profile.interview_count += 1
            
            return {"success": True, "data": {"transcript": transcript, "completed": True, "progress": 1.0, "summary": summary}}
        
        next_q = get_next_question(session)
        session["current_question"] = next_q
        return {"success": True, "data": {"transcript": transcript, "next_question": next_q, "progress": session["progress"], "completed": False}}
        
    except Exception as e:
        logger.error(f"Error: {e}")
        import traceback; traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": {"message": str(e)}})

def extract_info(transcript, profile):
    """IMPROVED extraction"""
    updates = []
    t = transcript.lower()
    
    # Experience
    m = re.search(r'(\d+)\s*(?:plus|\+)?\s*(?:years?|yrs?)', t)
    if m: updates.append({"field": "experience_years", "value": int(m.group(1))})
    
    # Skills - broader
    skills = ["python", "java", "machine learning", "cloud computing", "software", "web development", "tailoring", "teaching", "cooking", "programming", "ml", "ai"]
    for skill in skills:
        if skill in t:
            updates.append({"field": "skill", "value": skill})
            break
    
    # Location
    cities = ["tamil nadu", "chennai", "mumbai", "delhi", "bangalore", "kolkata", "hyderabad", "india"]
    for city in cities:
        if city in t:
            updates.append({"field": "location", "value": city.title()})
            break
    return updates

async def generate_ai_summary(transcript_data, profile):
    """Generate DETAILED summary using Qwen LLM with longer timeout"""
    conversation = ""
    for item in transcript_data:
        conversation += f"Q: {item['question']}\nA: {item['answer']}\n"
    
    prompt = f"""You are an expert professional profile writer for ElderSkill.

Based on the voice interview transcript, create a concise, highly professional
profile summary that uniquely describes the person's work, expertise, and value.

INTERVIEW TRANSCRIPT:
{conversation}

EXTRACTED DATA:
- Skills: {profile.get('skill', 'Not specified')}
- Experience: {profile.get('experience_years', 'Not specified')} years
- Location: {profile.get('location', 'Not specified')}

WRITING REQUIREMENTS:
1. Write ONLY 4-5 lines.
2. Use sophisticated, professional vocabulary.
3. Describe their work uniquely rather than simply listing skills.
4. Emphasize their practical expertise, experience, and professional value.
5. Make the profile sound distinctive and credible.
6. Use specific details from their answers whenever available.
7. Include relevant employer-searchable keywords naturally.
8. Avoid generic phrases such as "hardworking", "passionate", "dedicated",
   "highly motivated", or "team player" unless the interview specifically supports them.
9. Do NOT invent achievements, experience, skills, or qualifications.
10. Do NOT use headings, bullet points, numbering, or labels.
11. Return one polished professional paragraph of approximately 60-90 words.

The final result should read like a premium professional profile written by an
experienced recruiter, clearly communicating what this person does and what
makes their expertise valuable."""

    try:
        # Use LONGER timeout (120 seconds) for detailed response
        async with httpx.AsyncClient(timeout=600) as client:
            r = await client.post(
                f"{LLM_BASE_URL}/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": LLM_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are an expert career profile writer who creates detailed, descriptive professional summaries."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 800,
                    "temperature": 0.8,
                    "stream": False
                }
            )
            
            logger.info(f"LLM Status: {r.status_code}")
            
            if r.status_code == 200:
                result = r.json()
                if "choices" in result and result["choices"]:
                    summary = result["choices"][0]["message"]["content"].strip()
                    logger.info(f"✅ AI Summary length: {len(summary)} chars")
                    return summary
            else:
                logger.error(f"LLM Error: {r.status_code} - {r.text[:200]}")
                
    except Exception as e:
        logger.error(f"LLM Exception: {e}")
    
    return None

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
    return questions[min(session["question_number"]-1, len(questions)-1)]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
