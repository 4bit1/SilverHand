import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv()

base_url = os.getenv("LLM_BASE_URL")
model = os.getenv("LLM_MODEL")
api_key = os.getenv("LLM_API_KEY")

print("1. .env is loaded:", bool(base_url))
print("2. LLM_BASE_URL is present:", base_url)
print("3. LLM_MODEL is present:", model)
print("4. LLM_API_KEY is present:", bool(api_key))

try:
    headers = {}
    if api_key: headers["Authorization"] = f"Bearer {api_key}"
    r = httpx.get(f"{base_url}/models", headers=headers, timeout=10)
    print("6. /v1/models reachable. Status:", r.status_code)
except Exception as e:
    print("6. Error reaching endpoint:", e)
