from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    full_name: str
    password_hash: str
    role: str = "candidate"  # "candidate" or "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserRegisterReq(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLoginReq(BaseModel):
    email: EmailStr
    password: str

class TranscriptTurn(BaseModel):
    question_id: str
    question: str
    user_audio_url: Optional[str] = None
    user_transcript: str
    ai_evaluation: str
    score: float
    difficulty: str
    metrics: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class InterviewSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    topic: str  # DSA, DBMS, OOP, OS, CN, HR
    difficulty: str  # Easy, Medium, Hard
    status: str = "in_progress"  # in_progress, completed, abandoned
    total_questions: int = 5
    current_question_index: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class TranscriptSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    interview_id: str
    user_id: str
    turns: List[TranscriptTurn] = Field(default_factory=list)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ScoreSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    interview_id: str
    user_id: str
    total_score: float
    technical_accuracy: float
    problem_solving: float
    communication: float
    confidence: float
    professionalism: float
    feedback_summary: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnalyticsSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    interview_id: str
    avg_wpm: float
    total_filler_words: int
    avg_eye_contact: float
    dominant_emotion: str
    head_pose_stability: float
    recorded_at: datetime = Field(default_factory=datetime.utcnow)

class ReportSchema(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    interview_id: str
    user_id: str
    pdf_url: str
    download_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
