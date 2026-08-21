import os
from google import genai
from dotenv import load_dotenv
load_dotenv()


client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

print("\n=== AVAILABLE REASONING / THINKING MODELS ===\n")

for model in client.models.list():
    name = model.name
    thinking = getattr(model, "thinking", False)
    actions = getattr(model, "supported_actions", [])

    if "generateContent" in actions and thinking:
        print(f"Model       : {name}")
        print(f"Display     : {getattr(model, 'display_name', 'N/A')}")
        print(f"Thinking    : {thinking}")
        print(f"Input limit : {getattr(model, 'input_token_limit', 'N/A')}")
        print(f"Output limit: {getattr(model, 'output_token_limit', 'N/A')}")
        print("-" * 60)