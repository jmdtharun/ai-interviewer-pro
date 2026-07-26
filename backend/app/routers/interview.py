from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import os
import json
from datetime import datetime

from database.connection import get_database
from ai_models.llm_prompts import llm_engine
from ai_models.vision_processor import vision_engine
from ai_models.audio_processor import audio_analyzer
from ai_models.stt_engine import stt_service
from app.core.scoring import ScoringEngine
from app.config import settings
from services.pdf_generator import pdf_service
from services.storage_service import storage_manager

router = APIRouter(prefix="/interview", tags=["Interview Flow"])

# In-memory store for fallback/dev execution
MOCK_INTERVIEWS_DB: Dict[str, Any] = {}
MOCK_TRANSCRIPTS_DB: Dict[str, Any] = {}
MOCK_SCORES_DB: Dict[str, Any] = {}

class StartInterviewReq(BaseModel):
    user_id: str = "usr_demo_candidate_123"
    topic: str = "DSA" # DSA, DBMS, OOP, OS, CN, HR
    difficulty: str = "Medium" # Easy, Medium, Hard
    total_questions: int = 5

@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_interview(req: StartInterviewReq):
    """Initialize a new interview session and get the first adaptive question."""
    interview_id = f"int_{uuid.uuid4().hex[:12]}"
    
    first_question = await llm_engine.generate_first_question(req.topic, req.difficulty)
    
    interview_data = {
        "id": interview_id,
        "user_id": req.user_id,
        "topic": req.topic,
        "difficulty": req.difficulty,
        "status": "in_progress",
        "total_questions": req.total_questions,
        "current_question_index": 1,
        "first_question": first_question,
        "created_at": datetime.utcnow().isoformat()
    }

    db = get_database()
    if db is not None:
        try:
            await db.interviews.insert_one(interview_data)
            await db.transcripts.insert_one({
                "interview_id": interview_id,
                "user_id": req.user_id,
                "turns": [],
                "created_at": datetime.utcnow()
            })
        except Exception:
            pass

    # Save to mock DB
    MOCK_INTERVIEWS_DB[interview_id] = interview_data
    MOCK_TRANSCRIPTS_DB[interview_id] = []

    return {
        "interview_id": interview_id,
        "topic": req.topic,
        "difficulty": req.difficulty,
        "current_question_index": 1,
        "total_questions": req.total_questions,
        "question": first_question
    }

@router.post("/answer")
async def submit_answer(
    interview_id: str = Form(...),
    user_id: str = Form("usr_demo_candidate_123"),
    turn_index: int = Form(1),
    current_question: str = Form(...),
    user_transcript: Optional[str] = Form(None),
    audio_duration: float = Form(5.0),
    audio_file: Optional[UploadFile] = File(None),
    webcam_frame: Optional[UploadFile] = File(None)
):
    """
    Process candidate response turn:
    - Audio STT transcription
    - Vision metrics (eye-contact, smile, head pose)
    - Speech analytics (WPM, filler words, energy)
    - LLM adaptive evaluation & follow-up question
    """
    # 1. Handle STT
    audio_bytes = await audio_file.read() if audio_file else None
    if audio_bytes and not user_transcript:
        user_transcript = stt_service.transcribe_audio(audio_bytes)

    if not user_transcript or len(user_transcript.strip()) == 0:
        user_transcript = "I implemented a hash table with O(1) complexity and handled collisions via chaining."

    # 2. Vision Analytics
    frame_bytes = await webcam_frame.read() if webcam_frame else None
    vision_metrics = vision_engine.analyze_frame(frame_bytes)

    # 3. Audio Analytics
    audio_metrics = audio_analyzer.analyze_audio_and_transcript(
        transcript=user_transcript,
        duration_seconds=audio_duration,
        audio_bytes=audio_bytes
    )

    combined_metrics = {**vision_metrics, **audio_metrics}

    # 4. LLM Turn Evaluation
    eval_result = await llm_engine.evaluate_answer_and_next_question(
        topic="DSA",
        turn_number=turn_index,
        previous_question=current_question,
        candidate_answer=user_transcript,
        previous_score=75.0
    )

    turn_data = {
        "question_id": f"q_{turn_index}",
        "question": current_question,
        "user_transcript": user_transcript,
        "ai_evaluation": eval_result.get("evaluation", "Good presentation of technical trade-offs."),
        "score": eval_result.get("score", 80.0),
        "difficulty": eval_result.get("difficulty", "Medium"),
        "metrics": combined_metrics,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Retrieve or update transcript log
    turns = MOCK_TRANSCRIPTS_DB.get(interview_id, [])
    turns.append(turn_data)
    MOCK_TRANSCRIPTS_DB[interview_id] = turns

    interview = MOCK_INTERVIEWS_DB.get(interview_id, {
        "id": interview_id,
        "total_questions": 5,
        "topic": "DSA",
        "difficulty": "Medium"
    })

    total_q = interview.get("total_questions", 5)
    is_last_turn = turn_index >= total_q

    # Update scorecard
    avg_tech = sum(t["score"] for t in turns) / len(turns)
    scorecard = ScoringEngine.evaluate_interview(
        technical_accuracy=avg_tech,
        problem_solving=avg_tech * 0.95,
        metrics=combined_metrics
    )

    MOCK_SCORES_DB[interview_id] = scorecard

    # Generate PDF scorecard report if finished
    pdf_path = None
    if is_last_turn:
        interview["status"] = "completed"
        pdf_path = pdf_service.generate_interview_report(
            interview_id=interview_id,
            user_name="Alex Mercer",
            topic=interview.get("topic", "DSA"),
            difficulty=interview.get("difficulty", "Medium"),
            scorecard=scorecard,
            transcript_turns=turns
        )

    return {
        "interview_id": interview_id,
        "turn_index": turn_index,
        "evaluated_score": eval_result.get("score", 80.0),
        "evaluation": eval_result.get("evaluation", ""),
        "next_question": eval_result.get("next_question", "") if not is_last_turn else None,
        "is_completed": is_last_turn,
        "metrics": combined_metrics,
        "scorecard": scorecard,
        "pdf_available": is_last_turn
    }

@router.get("/{interview_id}")
async def get_interview_detail(interview_id: str):
    """Retrieve full interview status, transcript turns, and scorecard."""
    if interview_id.lower() == "setup":
        raise HTTPException(status_code=404, detail="Route setup is a frontend page, not an interview ID.")

    interview = MOCK_INTERVIEWS_DB.get(interview_id)
    if not interview:
        # Fallback sample interview return for UI demonstration
        return {
            "id": interview_id,
            "topic": "DSA",
            "difficulty": "Medium",
            "status": "completed",
            "scorecard": ScoringEngine.evaluate_interview(85.0, 80.0, {}),
            "transcript_turns": [
                {
                    "question": "Can you explain how a Hash Map works under the hood and what collision resolution strategies exist?",
                    "user_transcript": "A Hash map uses a hash function to map keys to bucket indices. Collisions are resolved via chaining or open addressing.",
                    "ai_evaluation": "Clear explanation of hash buckets and collision strategies.",
                    "score": 88.0,
                    "metrics": {"wpm": 142.0, "filler_words": 1, "eye_contact_score": 85.0, "dominant_emotion": "confident"}
                }
            ]
        }

    turns = MOCK_TRANSCRIPTS_DB.get(interview_id, [])
    scorecard = MOCK_SCORES_DB.get(interview_id, ScoringEngine.evaluate_interview(80.0, 75.0, {}))

    return {
        "id": interview_id,
        "topic": interview.get("topic"),
        "difficulty": interview.get("difficulty"),
        "status": interview.get("status", "in_progress"),
        "scorecard": scorecard,
        "transcript_turns": turns
    }

@router.get("/{interview_id}/report")
async def download_report(interview_id: str):
    """Download or view generated PDF scorecard report."""
    file_name = f"interview_report_{interview_id}.pdf"
    file_path = os.path.join(settings.REPORTS_DIR, file_name)

    if not os.path.exists(file_path):
        # Generate sample PDF report on the fly
        scorecard = ScoringEngine.evaluate_interview(85.0, 82.0, {})
        turns = [
            {
                "question": "Explain ACID properties in relational databases and how atomicity is enforced.",
                "user_transcript": "ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity is enforced using undo logs.",
                "ai_evaluation": "Accurate explanation of database logging mechanisms.",
                "score": 86.0
            }
        ]
        file_path = pdf_service.generate_interview_report(
            interview_id=interview_id,
            user_name="Alex Mercer",
            topic="DBMS",
            difficulty="Medium",
            scorecard=scorecard,
            transcript_turns=turns
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_name
    )
