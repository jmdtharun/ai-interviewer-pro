from typing import Dict, Any, List
import math

class ScoringEngine:
    """
    Weighted Placement Interview Scoring Algorithm:
    - Technical Accuracy: 40%
    - Problem Solving: 20%
    - Communication: 20%
    - Confidence: 10%
    - Professionalism: 10%
    Total Score: 100
    """

    @staticmethod
    def calculate_communication_score(
        wpm: float,
        filler_word_count: int,
        total_words: int,
        pause_duration: float
    ) -> float:
        """
        Calculate Communication score out of 100:
        Optimal WPM: 130 - 160 WPM
        Filler word ratio penalty: > 3% filler words incurs deduction
        Pause duration penalty: long silent pauses (> 10s total) reduce score
        """
        # 1. WPM Score (40 pts)
        if 120 <= wpm <= 165:
            wpm_score = 40.0
        elif 90 <= wpm < 120 or 165 < wpm <= 190:
            wpm_score = 30.0
        elif 60 <= wpm < 90 or 190 < wpm <= 220:
            wpm_score = 20.0
        else:
            wpm_score = 10.0

        # 2. Filler Word Score (40 pts)
        word_count = max(total_words, 1)
        filler_ratio = filler_word_count / word_count
        if filler_ratio <= 0.02:
            filler_score = 40.0
        elif filler_ratio <= 0.05:
            filler_score = 30.0
        elif filler_ratio <= 0.10:
            filler_score = 20.0
        else:
            filler_score = 10.0

        # 3. Flow & Pause Score (20 pts)
        if pause_duration <= 5.0:
            pause_score = 20.0
        elif pause_duration <= 12.0:
            pause_score = 15.0
        elif pause_duration <= 20.0:
            pause_score = 10.0
        else:
            pause_score = 5.0

        return min(100.0, wpm_score + filler_score + pause_score)

    @staticmethod
    def calculate_confidence_score(
        eye_contact_percentage: float,
        voice_energy_db: float,
        smile_score: float
    ) -> float:
        """
        Calculate Confidence score out of 100:
        - Eye Contact: 50 pts (target > 70%)
        - Voice Energy / Modulation: 30 pts
        - Positive Facial Expression (Smile): 20 pts
        """
        # Eye contact component (0-50)
        eye_score = min(50.0, (eye_contact_percentage / 100.0) * 50.0)
        
        # Voice energy component (0-30)
        # Assuming voice_energy normalized 0 to 1
        energy_score = min(30.0, max(10.0, voice_energy_db * 30.0))
        
        # Smile / Openness component (0-20)
        smile_comp = min(20.0, max(5.0, smile_score * 20.0))
        
        return min(100.0, eye_score + energy_score + smile_comp)

    @staticmethod
    def calculate_professionalism_score(
        head_pose_stability: float,
        engagement_score: float,
        emotion: str
    ) -> float:
        """
        Calculate Professionalism score out of 100:
        - Posture & Head Stability: 40 pts
        - Attentiveness & Engagement: 40 pts
        - Emotion demeanor (Confident, Calm, Neutral, Focused): 20 pts
        """
        posture_score = min(40.0, head_pose_stability * 40.0)
        engagement_comp = min(40.0, engagement_score * 40.0)
        
        positive_emotions = ["confident", "focused", "happy", "neutral", "calm"]
        emotion_comp = 20.0 if emotion.lower() in positive_emotions else 10.0
        
        return min(100.0, posture_score + engagement_comp + emotion_comp)

    @classmethod
    def evaluate_interview(
        cls,
        technical_accuracy: float, # 0 to 100
        problem_solving: float,     # 0 to 100
        metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Computes overall scorecard according to target weights:
        Technical: 40%
        Problem Solving: 20%
        Communication: 20%
        Confidence: 10%
        Professionalism: 10%
        """
        wpm = metrics.get("wpm", 135.0)
        filler_count = metrics.get("filler_words", 2)
        total_words = metrics.get("total_words", 80)
        pause_duration = metrics.get("pause_duration", 3.5)
        
        eye_contact = metrics.get("eye_contact_score", 82.0)
        voice_energy = metrics.get("voice_energy", 0.8)
        smile_score = metrics.get("smile_score", 0.6)
        
        head_stability = metrics.get("head_pose_stability", 0.85)
        engagement = metrics.get("engagement_score", 0.90)
        emotion = metrics.get("dominant_emotion", "confident")

        comm_score = cls.calculate_communication_score(wpm, filler_count, total_words, pause_duration)
        conf_score = cls.calculate_confidence_score(eye_contact, voice_energy, smile_score)
        prof_score = cls.calculate_professionalism_score(head_stability, engagement, emotion)

        tech_score = max(0.0, min(100.0, technical_accuracy))
        ps_score = max(0.0, min(100.0, problem_solving))

        weighted_total = (
            (tech_score * 0.40) +
            (ps_score * 0.20) +
            (comm_score * 0.20) +
            (conf_score * 0.10) +
            (prof_score * 0.10)
        )

        return {
            "total_score": round(weighted_total, 1),
            "breakdown": {
                "technical_accuracy": round(tech_score, 1),
                "problem_solving": round(ps_score, 1),
                "communication": round(comm_score, 1),
                "confidence": round(conf_score, 1),
                "professionalism": round(prof_score, 1)
            },
            "weights": {
                "technical_accuracy": 0.40,
                "problem_solving": 0.20,
                "communication": 0.20,
                "confidence": 0.10,
                "professionalism": 0.10
            },
            "feedback_summary": cls._generate_qualitative_feedback(
                weighted_total, tech_score, ps_score, comm_score, conf_score
            )
        }

    @staticmethod
    def _generate_qualitative_feedback(
        total: float, tech: float, ps: float, comm: float, conf: float
    ) -> List[str]:
        feedback = []
        if total >= 85:
            feedback.append("Outstanding overall interview performance! Ready for top-tier placement offers.")
        elif total >= 70:
            feedback.append("Solid performance. Minor refinements in technical depth and delivery will elevate your profile.")
        else:
            feedback.append("Good effort. Recommended to review foundational concepts and practice mock delivery.")

        if tech < 70:
            feedback.append("Technical area for improvement: Enhance precision when detailing data structures & algorithms.")
        if comm < 75:
            feedback.append("Communication tip: Regulate speaking pace (130-150 WPM) and reduce hesitation filler words.")
        if conf < 70:
            feedback.append("Confidence tip: Maintain direct eye contact with the camera and steady posture.")

        return feedback
