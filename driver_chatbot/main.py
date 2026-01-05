import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from chatbot_engine import DriverChatbot

app = FastAPI(title="Driver Panel AI Service")

# Global chatbot instance or session manager
# For this demo, we can just instantiate one engine logic, 
# but ideally we want separate chat sessions per user.
# We will use a simple in-memory dict for session management.
chat_sessions = {}

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    status: str

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    user_id = request.user_id
    user_message = request.message
    
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Retrieve or create a chat session for this user
    if user_id not in chat_sessions:
        # Initialize a new chatbot instance for this user
        # Note: In a production app, this might be too heavy. 
        # Standard pattern with Gemini API is to just manage history list and send it.
        # But instantiating our wrapper class is fine for a demo.
        chat_sessions[user_id] = DriverChatbot()
    
    bot_instance = chat_sessions[user_id]
    
    # Get response
    answer = bot_instance.ask(user_message)
    
    return ChatResponse(
        reply=answer,
        status="success"
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
