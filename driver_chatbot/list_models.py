import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    with open("models_clean.txt", "w", encoding="utf-8") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(m.name + "\n")
    print("Models written to models_clean.txt")
except Exception as e:
    print(f"Error: {e}")
