from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient
import json
from datetime import datetime
import uuid
import base64
from PIL import Image
import io
from typing import Optional, List
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Health Chatbot API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.ai_health_chatbot

# Google Gemini AI configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini models
text_model = genai.GenerativeModel('gemini-pro')
vision_model = genai.GenerativeModel('gemini-pro-vision')

# Health knowledge base for better responses
HEALTH_CONTEXT = """
You are an AI Health Chatbot designed to provide public health information. Your responses should:
1. Focus on disease prevention, symptom awareness, and health education
2. Provide vaccination reminders and schedules
3. Give preventive health tips
4. Share government health alerts and guidelines
5. Always recommend consulting healthcare professionals for serious concerns
6. Be culturally sensitive and accessible to rural populations
7. Respond in simple, understandable language

Key areas of expertise:
- Common diseases: dengue, malaria, typhoid, COVID-19, diabetes, hypertension
- Vaccination schedules for children and adults
- Preventive measures for communicable diseases
- Basic first aid and emergency care
- Maternal and child health
- Nutrition and hygiene practices
"""

@app.get("/")
async def root():
    return {"message": "AI Health Chatbot API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/chat")
async def chat_message(message: dict):
    try:
        user_message = message.get("message", "")
        language = message.get("language", "english")
        session_id = message.get("session_id", str(uuid.uuid4()))
        
        # Create language-specific prompt
        language_instruction = f"Respond in {language} language. "
        full_prompt = language_instruction + HEALTH_CONTEXT + f"\n\nUser question: {user_message}"
        
        # Generate response using Gemini
        response = text_model.generate_content(full_prompt)
        ai_response = response.text
        
        # Store conversation in database
        conversation = {
            "session_id": session_id,
            "user_message": user_message,
            "ai_response": ai_response,
            "language": language,
            "timestamp": datetime.now(),
            "message_type": "text"
        }
        db.conversations.insert_one(conversation)
        
        return {
            "response": ai_response,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.post("/api/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),
    question: str = Form("What health information can you provide from this image?"),
    language: str = Form("english"),
    session_id: str = Form(None)
):
    try:
        if not session_id:
            session_id = str(uuid.uuid4())
            
        # Read and process image
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Create health-focused prompt for image analysis
        health_image_prompt = f"""
        Analyze this image from a healthcare perspective. Look for:
        1. Visible symptoms or health conditions
        2. Medical documents, prescriptions, or reports
        3. Health-related items or situations
        4. Any health risks or concerns
        
        Provide helpful, accurate health information while recommending professional medical consultation for diagnosis.
        Respond in {language} language.
        
        User question: {question}
        """
        
        # Analyze image with Gemini Vision
        response = vision_model.generate_content([health_image_prompt, pil_image])
        analysis_result = response.text
        
        # Store in database
        image_analysis = {
            "session_id": session_id,
            "question": question,
            "analysis_result": analysis_result,
            "language": language,
            "timestamp": datetime.now(),
            "message_type": "image_analysis",
            "image_name": image.filename
        }
        db.conversations.insert_one(image_analysis)
        
        return {
            "analysis": analysis_result,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.post("/api/voice-to-text")
async def voice_to_text(
    audio: UploadFile = File(...),
    language: str = Form("english"),
    session_id: str = Form(None)
):
    try:
        if not session_id:
            session_id = str(uuid.uuid4())
            
        # For now, return a placeholder response
        # In production, you would integrate with speech recognition service
        return {
            "transcribed_text": "Voice processing feature coming soon...",
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing voice: {str(e)}")

@app.get("/api/vaccination-reminders")
async def get_vaccination_reminders(age_group: str = "child", language: str = "english"):
    try:
        vaccination_prompt = f"""
        Provide vaccination schedule and reminders for {age_group}s.
        Include:
        1. Due vaccinations based on age
        2. Government recommended schedule
        3. Importance of each vaccine
        4. Next appointment suggestions
        
        Respond in {language} language.
        Focus on Indian government vaccination guidelines.
        """
        
        response = text_model.generate_content(vaccination_prompt)
        vaccination_info = response.text
        
        return {
            "vaccination_info": vaccination_info,
            "age_group": age_group,
            "language": language,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting vaccination info: {str(e)}")

@app.get("/api/health-alerts")
async def get_health_alerts(location: str = "india", language: str = "english"):
    try:
        alerts_prompt = f"""
        Provide current health alerts and advisories for {location}.
        Include:
        1. Seasonal health warnings
        2. Disease outbreak information
        3. Preventive measures
        4. Government health advisories
        
        Respond in {language} language.
        Focus on public health information from reliable sources.
        """
        
        response = text_model.generate_content(alerts_prompt)
        alerts_info = response.text
        
        return {
            "health_alerts": alerts_info,
            "location": location,
            "language": language,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting health alerts: {str(e)}")

@app.get("/api/conversation-history/{session_id}")
async def get_conversation_history(session_id: str):
    try:
        conversations = list(db.conversations.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1))
        
        return {
            "session_id": session_id,
            "conversations": conversations,
            "count": len(conversations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")

@app.get("/api/supported-languages")
async def get_supported_languages():
    return {
        "languages": [
            {"code": "english", "name": "English", "native_name": "English"},
            {"code": "hindi", "name": "Hindi", "native_name": "हिंदी"},
            {"code": "tamil", "name": "Tamil", "native_name": "தமிழ்"},
            {"code": "telugu", "name": "Telugu", "native_name": "తెలుగు"},
            {"code": "bengali", "name": "Bengali", "native_name": "বাংলা"},
            {"code": "marathi", "name": "Marathi", "native_name": "मराठी"},
            {"code": "gujarati", "name": "Gujarati", "native_name": "ગુજરાતી"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)