
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import numpy as np
import logging
import uuid
from typing import Optional
from datetime import datetime
import re
import os
from pathlib import Path
from dotenv import load_dotenv

from app.utils.audio_processor import decode_audio
from app.asr.sarvam_asr import SarvamASR
from app.api.routes.matching import router as matching_router

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="ElderSkill Voice Interview")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(matching_router)

sarvam_asr = None
whisper_model = None
sessions = {}

class InterviewStartRequest(BaseModel):
    user_id: str
    language: str = "en"

@app.on_event("startup")
async def startup_event():
    global sarvam_asr, whisper_model
    
    sarvam_api_key = os.getenv("SARVAM_API_KEY", "")
    if sarvam_api_key:
        try:
            sarvam_asr = SarvamASR(api_key=sarvam_api_key, model="saaras:v3")
            logger.info("✅ Sarvam ASR ready (PRIMARY)")
        except Exception as e:
            logger.error(f"❌ Sarvam init failed: {e}")
    
    try:
        import whisper
        whisper_model = whisper.load_model("base", device="cpu")
        logger.info("✅ Whisper ready (FALLBACK)")
    except:
        logger.warning("Whisper not available")

@app.get("/", response_class=HTMLResponse)
async def root():
    return Path("app/templates/index.html").read_text()

@app.post("/api/interviews/start")
async def start_interview(request: InterviewStartRequest):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "user_id": request.user_id,
        "language": request.language,
        "profile": {},
        "current_question": "What is the one skill you are best known for?",
        "question_number": 0,
        "progress": 0,
        "history": [],
        "all_answers": []
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
            asr_used = "text_input"
            
        elif "multipart/form-data" in content_type:
            form = await request.form()
            
            if "audio" in form:
                audio_file = form["audio"]
                audio_bytes = await audio_file.read()
                logger.info(f"📥 Audio received: {len(audio_bytes)} bytes")
                
                audio_np = decode_audio(audio_bytes, audio_file.filename)
                
                if audio_np is None:
                    return JSONResponse(content={"success": False, "error": {"message": "Audio processing failed"}})
                
                language = session.get("language", "en")
                
                if sarvam_asr:
                    logger.info("🎯 Attempting SARVAM transcription...")
                    try:
                        result = sarvam_asr.transcribe(audio_np, language)
                        if result and result.text.strip():
                            transcript = result.text.strip()
                            asr_used = "sarvam"
                            logger.info(f"✅ SARVAM: '{transcript}'")
                    except Exception as e:
                        logger.warning(f"⚠️ Sarvam failed: {e}")
                        transcript = ""
                
                if not transcript and whisper_model:
                    logger.info("🔄 Falling back to WHISPER...")
                    try:
                        result = whisper_model.transcribe(audio_np, fp16=False)
                        transcript = result["text"].strip()
                        asr_used = "whisper"
                        logger.info(f"✅ WHISPER: '{transcript}'")
                    except Exception as e:
                        logger.error(f"❌ Whisper failed: {e}")
        
        if not transcript:
            return JSONResponse(content={"success": False, "error": {"message": "We couldn't understand that clearly. Please try again."}})
        
        # Store answer
        session["history"].append({"type": "answer", "text": transcript, "asr": asr_used})
        session["all_answers"].append(transcript)
        
        # Extract profile info
        updates = extract_info(transcript, session["profile"])
        for u in updates:
            session["profile"][u["field"]] = u["value"]
        
        session["question_number"] += 1
        session["progress"] = session["question_number"] / 8
        
        if session["question_number"] >= 8:
            session["progress"] = 1.0  # Ensure 100%
            summary = generate_descriptive_summary(session["profile"], session["all_answers"])
            session["summary"] = summary
            
            return {
                "success": True,
                "data": {
                    "transcript": transcript,
                    "asr_used": asr_used,
                    "completed": True,
                    "progress": 1.0,
                    "summary": summary,
                    "profile": session["profile"]
                }
            }
        
        next_q = get_next_question(session)
        session["current_question"] = next_q
        
        return {
            "success": True,
            "data": {
                "transcript": transcript,
                "asr_used": asr_used,
                "next_question": next_q,
                "progress": session["progress"],
                "completed": False
            }
        }
        
    except Exception as e:
        logger.error(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": {"message": str(e)}})

def extract_info(transcript, profile):
    """Extract structured information from transcript"""
    updates = []
    t = transcript.lower()
    
    # Name
    m = re.search(r'(?:my name is|i am|i\'m)\s+([a-zA-Z]+)', t)
    if m:
        updates.append({"field": "name", "value": m.group(1).title()})
    
    # Years of experience
    m = re.search(r'(\d+)\s*(?:plus|\+)?\s*(?:years?|yrs?)', t)
    if m:
        updates.append({"field": "experience_years", "value": int(m.group(1))})
    
    # Skills - broader list
    skills = [
        "software development", "web development", "machine learning", "cloud computing",
        "python", "java", "tailoring", "teaching", "cooking", "farming", 
        "carpentry", "programming", "sewing", "embroidery", "model fine tuning",
        "software engineer", "development"
    ]
    for skill in skills:
        if skill in t:
            if "skill" not in profile or profile.get("skill") != skill:
                if profile.get("skill") and skill in ["development", "programming"]:
                    continue
                updates.append({"field": "skill", "value": skill})
            break
    
    # Location
    cities = ["chennai", "mumbai", "delhi", "bangalore", "kolkata", "hyderabad", "pune"]
    for city in cities:
        if city in t:
            updates.append({"field": "location", "value": city.title()})
            break
    
    # Interests
    interests = ["solving", "problem solving", "real world", "teaching", "mentoring"]
    for interest in interests:
        if interest in t:
            updates.append({"field": "interest", "value": interest})
            break
    
    return updates

def generate_descriptive_summary(profile, all_answers):
    """Generate a rich, descriptive, keyword-rich profile summary"""
    
    # Extract key information
    name = profile.get("name", "")
    skill = profile.get("skill", "")
    years = profile.get("experience_years", "")
    location = profile.get("location", "")
    interest = profile.get("interest", "")
    
    # Combine all answers for keyword extraction
    full_text = " ".join(all_answers).lower()
    
    # Detect additional keywords
    keywords = []
    keyword_list = [
        "software development", "web development", "machine learning", "cloud computing",
        "python", "java", "model fine tuning", "artificial intelligence", "ai",
        "problem solving", "real world", "mentoring", "teaching", "leadership",
        "amazon", "software engineer", "development"
    ]
    
    for kw in keyword_list:
        if kw in full_text and kw not in keywords:
            keywords.append(kw)
    
    # Build descriptive summary
    summary_parts = []
    
    if name:
        summary_parts.append(f"{name} is a seasoned professional")
    else:
        summary_parts.append("An experienced professional")
    
    if skill:
        if skill == "software development" or "software engineer" in skill:
            summary_parts.append(f"with extensive expertise in {skill}")
        else:
            summary_parts.append(f"specializing in {skill}")
    
    if years:
        if int(years) >= 10:
            summary_parts.append(f"bringing over {years} years of hands-on experience")
        else:
            summary_parts.append(f"with {years} years of practical experience")
    
    if location:
        summary_parts.append(f"based in {location}")
    
    # Add keyword-rich description
    if keywords:
        keyword_str = ", ".join(keywords[:5])
        summary_parts.append(f"with deep knowledge in {keyword_str}")
    
    # Add interest/strength
    if interest or "problem solving" in full_text or "real world" in full_text:
        summary_parts.append("passionate about solving real-world problems through technology and innovation")
    
    if "teaching" in full_text or "mentoring" in full_text:
        summary_parts.append("experienced in mentoring and sharing knowledge with others")
    
    if "machine learning" in full_text or "cloud" in full_text:
        summary_parts.append("skilled in cutting-edge technologies including machine learning and cloud platforms")
    
    # Final sentence
    summary_parts.append("dedicated to delivering high-quality solutions that make a meaningful impact")
    
    return " ".join(summary_parts) + "."

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
