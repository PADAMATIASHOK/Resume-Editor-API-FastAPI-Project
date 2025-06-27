from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
import os
from datetime import datetime
import pdfplumber

app = FastAPI(title="Resume Editor API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
resume_storage = {}

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class AIEnhanceResponse(BaseModel):
    enhanced_content: str

class SaveResumeRequest(BaseModel):
    personalInfo: Dict[str, Any]
    summary: str
    experience: list
    education: list
    skills: list
    projects: Optional[list] = []

# Mock AI enhancement responses
AI_ENHANCEMENTS = {
    "summary": [
        "Results-driven professional with proven expertise in delivering high-impact solutions and driving organizational growth through strategic leadership and innovative problem-solving approaches.",
        "Dynamic and accomplished professional with a track record of excellence in cross-functional collaboration, project management, and delivering measurable business outcomes.",
        "Innovative and strategic professional with demonstrated success in leveraging cutting-edge technologies and best practices to drive operational efficiency and business transformation."
    ],
    "experience": [
        "• Spearheaded the development and implementation of scalable solutions, resulting in 40% improvement in system performance and enhanced user experience\n• Led cross-functional teams of 8+ members to deliver critical projects on time and within budget, consistently exceeding stakeholder expectations\n• Architected and deployed robust infrastructure solutions that reduced operational costs by 25% while improving system reliability\n• Mentored junior team members and established best practices that improved code quality and development velocity by 30%",
        "• Designed and implemented comprehensive solutions that streamlined business processes and improved operational efficiency by 35%\n• Collaborated with stakeholders across multiple departments to gather requirements and deliver solutions that aligned with business objectives\n• Optimized system performance through strategic refactoring and implementation of industry best practices\n• Established monitoring and alerting systems that reduced incident response time by 50%"
    ],
    "skills": [
        "Technical Skills: Advanced proficiency in modern development frameworks and cloud technologies with expertise in scalable architecture design\nLeadership Skills: Proven ability to lead cross-functional teams and drive strategic initiatives to successful completion\nProblem-Solving: Strong analytical skills with experience in identifying bottlenecks and implementing effective solutions",
        "Core Competencies: Full-stack development, system architecture, database optimization, and agile methodologies\nSoft Skills: Excellent communication, team collaboration, project management, and stakeholder engagement\nTechnical Expertise: Cloud platforms, DevOps practices, automated testing, and continuous integration/deployment"
    ],
    "education": [
        "Distinguished academic achievement with focus on cutting-edge technologies and practical application of theoretical concepts in real-world scenarios.",
        "Comprehensive educational foundation with emphasis on problem-solving methodologies and innovative approaches to complex technical challenges."
    ],
    "personal_info": [
        "Professional contact information optimized for networking and career advancement opportunities.",
        "Complete professional profile with verified contact details and established online presence."
    ]
}

@app.get("/")
async def root():
    return {"message": "Resume Editor API is running!"}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def ai_enhance(request: AIEnhanceRequest):
    """
    Mock AI enhancement service that provides improved content for resume sections
    """
    try:
        section = request.section.lower()
        
        if section not in AI_ENHANCEMENTS:
            # Generic enhancement for unknown sections
            enhanced = f"Enhanced version of: {request.content}\n\nThis content has been optimized for professional impact with improved clarity, stronger action verbs, and quantifiable achievements."
        else:
            # Get a random enhancement from the predefined options
            import random
            enhanced = random.choice(AI_ENHANCEMENTS[section])
        
        return AIEnhanceResponse(enhanced_content=enhanced)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.post("/save-resume")
async def save_resume(resume: SaveResumeRequest):
    """
    Save resume data to storage (in-memory for demo, could be database in production)
    """
    try:
        # Generate a unique ID for the resume
        resume_id = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Convert to dict and add metadata
        resume_data = resume.dict()
        resume_data["id"] = resume_id
        resume_data["saved_at"] = datetime.now().isoformat()
        
        # Store in memory
        resume_storage[resume_id] = resume_data
        
        # Also save to file for persistence across server restarts
        os.makedirs("data", exist_ok=True)
        with open(f"data/{resume_id}.json", "w") as f:
            json.dump(resume_data, f, indent=2)
        
        return {
            "message": "Resume saved successfully",
            "resume_id": resume_id,
            "saved_at": resume_data["saved_at"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")

@app.get("/resumes")
async def list_resumes():
    """
    List all saved resumes
    """
    try:
        resumes = []
        for resume_id, resume_data in resume_storage.items():
            resumes.append({
                "id": resume_id,
                "name": resume_data.get("personalInfo", {}).get("name", "Unknown"),
                "saved_at": resume_data.get("saved_at"),
            })
        
        return {"resumes": resumes}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list resumes: {str(e)}")

@app.get("/resume/{resume_id}")
async def get_resume(resume_id: str):
    """
    Retrieve a specific resume by ID
    """
    try:
        if resume_id not in resume_storage:
            # Try to load from file
            try:
                with open(f"data/{resume_id}.json", "r") as f:
                    resume_data = json.load(f)
                    resume_storage[resume_id] = resume_data
            except FileNotFoundError:
                raise HTTPException(status_code=404, detail="Resume not found")
        
        return resume_storage[resume_id]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve resume: {str(e)}")

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF resume, extracts text, and returns it. (Basic version)
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        contents = await file.read()
        with open("temp_resume.pdf", "wb") as f:
            f.write(contents)
        text = ""
        with pdfplumber.open("temp_resume.pdf") as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        os.remove("temp_resume.pdf")
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)