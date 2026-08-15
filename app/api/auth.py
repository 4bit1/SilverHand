
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from typing import Optional
import re
import logging

from app.models.user_auth import user_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

class SignupRequest(BaseModel):
    full_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    password: str
    
    @validator('email')
    def validate_email(cls, v):
        email = v.strip().lower()
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            raise ValueError('Please enter a valid email address')
        return email
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class LoginRequest(BaseModel):
    email: str
    password: str
    
    @validator('email')
    def validate_email(cls, v):
        return v.strip().lower()

@router.post("/signup")
async def signup(request: SignupRequest):
    """Sign up with UNIQUE email"""
    try:
        result = user_manager.create_user(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
            phone=request.phone
        )
        
        if not result["success"]:
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "error": {
                        "code": result["error"],
                        "message": result["message"]
                    }
                }
            )
        
        return {
            "success": True,
            "data": {
                "message": "Account created successfully!",
                "user": result["user"]
            }
        }
        
    except Exception as e:
        logger.error(f"Signup failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": {"message": str(e)}}
        )

@router.post("/login")
async def login(request: LoginRequest):
    """Login with EXACT email and password"""
    try:
        result = user_manager.authenticate_user(
            email=request.email,
            password=request.password
        )
        
        if not result["success"]:
            error_code = result.get("error", "UNKNOWN")
            
            if error_code == "USER_NOT_FOUND":
                status_code = 404
            elif error_code == "WRONG_PASSWORD":
                status_code = 401
            else:
                status_code = 400
            
            return JSONResponse(
                status_code=status_code,
                content={
                    "success": False,
                    "error": {
                        "code": error_code,
                        "message": result["message"]
                    }
                }
            )
        
        return {
            "success": True,
            "data": {
                "message": "Login successful!",
                "user": result["user"]
            }
        }
        
    except Exception as e:
        logger.error(f"Login failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": {"message": str(e)}}
        )

@router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get user profile"""
    user = user_manager.get_user_profile(user_id)
    
    if not user:
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": {"message": "User not found"}}
        )
    
    return {"success": True, "data": user}

@router.put("/users/{user_id}/profile")
async def update_profile(user_id: str, data: dict):
    """Update user profile"""
    profile = user_manager.update_user_profile(user_id, data)
    return {"success": True, "data": profile}
