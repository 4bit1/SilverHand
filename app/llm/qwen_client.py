import httpx
import json
import logging
from typing import Optional, Dict, Any, List
import os

logger = logging.getLogger(__name__)

class QwenClient:
    def __init__(self):
        self.base_url = os.getenv("LLM_BASE_URL", "https://creamlike-flashbulb-roman.ngrok-free.dev/v1")
        self.model = os.getenv("LLM_MODEL", "qwen/qwen2.5-72b-instruct")
        self.api_key = os.getenv("LLM_API_KEY", "")
        logger.info(f"Qwen client: {self.base_url} | {self.model}")
    
    def generate_profile_summary(self, transcript_data: List[Dict], profile: Dict) -> str:
        conversation = ""
        for item in transcript_data:
            conversation += f"Q: {item.get('question', '')}\nA: {item.get('answer', '')}\n\n"
        
        prompt = f"""You are an expert career profile writer for ElderSkill.

Based on the interview transcript, create a compelling profile summary.

TRANSCRIPT:
{conversation}

PROFILE DATA:
{json.dumps(profile, indent=2)}

INSTRUCTIONS:
1. Natural human tone (NOT AI-sounding)
2. Focus on actual skills and experience
3. Include employer-searchable keywords
4. 80-150 words
5. No invented information
6. No generic AI phrases

Return ONLY the summary text."""
        
        try:
            response = self._call(prompt, max_tokens=300, temperature=0.7)
            return response.strip().replace("**", "").replace("###", "")
        except Exception as e:
            logger.error(f"Summary failed: {e}")
            return None
    
    def generate_next_question(self, transcript_data: List[Dict], profile: Dict, question_number: int) -> str:
        conversation = ""
        for item in transcript_data:
            conversation += f"Q: {item.get('question', '')}\nA: {item.get('answer', '')}\n\n"
        
        prompt = f"""You are an interviewer for ElderSkill.

Progress: Question {question_number} of 8

HISTORY:
{conversation}

PROFILE SO FAR:
{json.dumps(profile, indent=2)}

Ask ONE natural follow-up question. Return ONLY the question."""
        
        try:
            response = self._call(prompt, max_tokens=100, temperature=0.5)
            return response.strip()
        except Exception as e:
            logger.error(f"Question failed: {e}")
            return None
    
    def _call(self, prompt: str, max_tokens: int = 300, temperature: float = 0.7) -> str:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are an expert career profile writer."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False
        }
        
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        with httpx.Client(timeout=60) as client:
            response = client.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"LLM error {response.status_code}: {response.text[:200]}")
            
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
            elif "response" in result:
                return result["response"]
            else:
                raise Exception(f"Unexpected format: {list(result.keys())}")