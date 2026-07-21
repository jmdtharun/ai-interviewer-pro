from fastapi import APIRouter
from database.connection import get_database
from typing import Dict, Any, List
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics Dashboard"])

@router.get("/user")
async def get_candidate_analytics(user_id: str = "usr_demo_candidate_123") -> Dict[str, Any]:
    """Retrieve candidate history, skill progression, and recent interview scorecards."""
    return {
        "user_id": user_id,
        "total_interviews_taken": 8,
        "average_overall_score": 83.4,
        "topic_breakdown": [
            {"topic": "DSA", "interviews": 3, "avg_score": 86.5},
            {"topic": "DBMS", "interviews": 2, "avg_score": 81.0},
            {"topic": "OOP", "interviews": 1, "avg_score": 88.0},
            {"topic": "OS", "interviews": 1, "avg_score": 79.5},
            {"topic": "HR", "interviews": 1, "avg_score": 82.0}
        ],
        "speech_and_vision_metrics": {
            "avg_wpm": 142.5,
            "avg_eye_contact_pct": 84.2,
            "avg_filler_words_per_session": 3.1,
            "dominant_emotion": "confident"
        },
        "recent_interviews": [
            {
                "id": "int_demo_9821",
                "topic": "DSA",
                "difficulty": "Hard",
                "score": 88.5,
                "date": "2026-07-20",
                "status": "completed"
            },
            {
                "id": "int_demo_7734",
                "topic": "DBMS",
                "difficulty": "Medium",
                "score": 81.0,
                "date": "2026-07-18",
                "status": "completed"
            },
            {
                "id": "int_demo_4412",
                "topic": "OOP",
                "difficulty": "Medium",
                "score": 88.0,
                "date": "2026-07-15",
                "status": "completed"
            }
        ]
    }

@router.get("/admin")
async def get_admin_analytics() -> Dict[str, Any]:
    """
    Admin Dashboard Metrics:
    - Total users
    - Interviews completed
    - Average score by topic
    - Most common weak areas
    - Emotion distribution
    - Daily activity chart
    """
    return {
        "summary": {
            "total_users": 1240,
            "interviews_completed": 3890,
            "active_today": 142,
            "avg_platform_score": 79.8
        },
        "avg_score_by_topic": [
            {"topic": "DSA", "avg_score": 76.2},
            {"topic": "DBMS", "avg_score": 81.5},
            {"topic": "OOP", "avg_score": 84.0},
            {"topic": "OS", "avg_score": 73.8},
            {"topic": "CN", "avg_score": 78.4},
            {"topic": "HR", "avg_score": 85.1}
        ],
        "most_common_weak_areas": [
            {"area": "Dynamic Programming (DSA)", "frequency": 412},
            {"area": "System Concurrency & Starvation (OS)", "frequency": 348},
            {"area": "B-Tree Index Overhead (DBMS)", "frequency": 289},
            {"area": "Speaking Pace & Filler Words (Comm)", "frequency": 245},
            {"area": "Eye Contact Maintenance (Confidence)", "frequency": 198}
        ],
        "emotion_distribution": [
            {"emotion": "Confident", "percentage": 52.4},
            {"emotion": "Focused", "percentage": 28.1},
            {"emotion": "Neutral", "percentage": 11.5},
            {"emotion": "Nervous", "percentage": 8.0}
        ],
        "daily_activity": [
            {"date": "Jul 15", "interviews": 180, "users": 65},
            {"date": "Jul 16", "interviews": 210, "users": 78},
            {"date": "Jul 17", "interviews": 245, "users": 92},
            {"date": "Jul 18", "interviews": 310, "users": 110},
            {"date": "Jul 19", "interviews": 290, "users": 105},
            {"date": "Jul 20", "interviews": 380, "users": 135},
            {"date": "Jul 21", "interviews": 420, "users": 142}
        ]
    }
