import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    # Fallback to look for it in stream lit secrets if deployed there, or warn user
    pass

def load_knowledge_base():
    """Loads the mocked driver manual content."""
    try:
        with open("data/driver_manual.md", "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return "Error: Driver manual not found."

class DriverChatbot:
    def __init__(self, api_key=None):
        self.api_key = api_key if api_key else API_KEY
        if hasattr(genai, 'configure'):
            genai.configure(api_key=self.api_key)
        
        self.model = genai.GenerativeModel('gemini-flash-latest')
        self.knowledge_base = load_knowledge_base()
        self.chat = self.model.start_chat(history=[])
        
        # We prime the history with a system instruction style message.
        self.system_prompt = f"""
        You are 'FleetPilot', an advanced and professional AI driver support assistant for the Driver Panel application.
        Your tone should be helpful, concise, and professional—similar to high-quality support agents.
        
        Information Source (Knowledge Base):
        --------------------------------------------------
        {self.knowledge_base}
        --------------------------------------------------
        
        RULES & GUIDELINES:
        1. **Professional Formatting**: Use clear headings, bullet points, and bold text for key terms to make your answers easy to read. 
           (e.g., "To start a trip:" followed by a numbered list).
        2. **Conciseness**: Give direct answers. Avoid fluff.
        3. **Strict Scope**: ONLY answer questions related to the Driver Panel, trips, vehicles, traffic, and earnings. 
           If a user asks about general topics (e.g., "Who won the match?", "Write code"), POLITELY refuse:
           "I specialize in Driver Panel support and cannot assist with external topics."
        4. **Empathy**: If the user seems frustrated (e.g., complaints about earnings), acknowledge it briefly before providing the factual answer.
        5. **No Hallucinations**: If the answer is not in the Knowledge Base, say "I don't have that information right now. Please check with your fleet manager."
        
        Example Interaction:
        User: "How do I start?"
        You: "**Starting a Trip** is easy:
        1. Navigate to **Start Trip** on your dashboard.
        2. Enter your **Destination**.
        3. Tap **Calculate Route** then **Start Trip**."
        """
        
        # Send the system prompt as the first "User" message to set context, 
        # or use system_instruction if using a newer SDK version that supports it reliably across models.
        # For robustness in this demo, we can just prepend context to queries or use a history hack.
        # But 'gemini-pro' supports multi-turn well. Let's try sending the context silently or keeping it in mind.
        # Actually, the best way with the standard API is to just send it once.
        self.chat.send_message(self.system_prompt)

    def ask(self, user_input):
        if not self.api_key:
            return "Please configure your Google Gemini API Key."
            
        try:
            response = self.chat.send_message(user_input)
            return response.text
        except Exception as e:
            return f"An error occurred: {str(e)}"
