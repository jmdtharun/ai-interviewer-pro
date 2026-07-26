from app.core.scoring import ScoringEngine

def test_scoring_weights():
    scorecard = ScoringEngine.evaluate_interview(
        technical_accuracy=90.0,
        problem_solving=80.0,
        metrics={
            "wpm": 140.0,
            "filler_words": 1,
            "total_words": 70,
            "pause_duration": 3.0,
            "eye_contact_score": 85.0,
            "voice_energy": 0.8,
            "smile_score": 0.6,
            "head_pose_stability": 0.9,
            "engagement_score": 0.9,
            "dominant_emotion": "confident"
        }
    )
    
    assert scorecard["total_score"] >= 80.0
    assert "technical_accuracy" in scorecard["breakdown"]
    assert scorecard["weights"]["technical_accuracy"] == 0.40
    assert scorecard["weights"]["problem_solving"] == 0.20

def test_communication_wpm_penalty():
    comm_normal = ScoringEngine.calculate_communication_score(
        wpm=140.0, filler_word_count=1, total_words=60, pause_duration=2.0
    )
    comm_too_fast = ScoringEngine.calculate_communication_score(
        wpm=240.0, filler_word_count=1, total_words=60, pause_duration=2.0
    )
    
    assert comm_normal > comm_too_fast
