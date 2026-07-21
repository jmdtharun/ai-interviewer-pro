from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_start_and_submit_interview():
    # 1. Start Interview
    start_res = client.post("/interview/start", json={
        "user_id": "test_candidate",
        "topic": "DSA",
        "difficulty": "Easy",
        "total_questions": 2
    })
    assert start_res.status_code == 201
    start_data = start_res.json()
    assert "interview_id" in start_data
    int_id = start_data["interview_id"]

    # 2. Submit Answer
    ans_res = client.post("/interview/answer", data={
        "interview_id": int_id,
        "turn_index": 1,
        "current_question": start_data["question"],
        "user_transcript": "I used a two-pointer approach to check for palindromes in linear time.",
        "audio_duration": 4.5
    })
    assert ans_res.status_code == 200
    ans_data = ans_res.json()
    assert ans_data["interview_id"] == int_id
    assert "metrics" in ans_data
