export type TopicType = 'DSA' | 'DBMS' | 'OOP' | 'OS' | 'CN' | 'HR';
export type DifficultyType = 'Easy' | 'Medium' | 'Hard';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'candidate' | 'admin';
}

export interface VisionMetrics {
  eye_contact_score: number;
  head_pose_stability: number;
  smile_score: number;
  engagement_score: number;
  dominant_emotion: string;
}

export interface AudioMetrics {
  wpm: number;
  total_words: number;
  filler_words: number;
  pause_duration: number;
  voice_energy: number;
  clarity_index: number;
}

export interface TurnMetrics extends VisionMetrics, AudioMetrics {}

export interface TranscriptTurn {
  question_id?: string;
  question: string;
  user_transcript: string;
  ai_evaluation: string;
  score: number;
  difficulty?: string;
  metrics?: Partial<TurnMetrics>;
  timestamp?: string;
}

export interface ScorecardBreakdown {
  technical_accuracy: number;
  problem_solving: number;
  communication: number;
  confidence: number;
  professionalism: number;
}

export interface Scorecard {
  total_score: number;
  breakdown: ScorecardBreakdown;
  feedback_summary: string[];
}

export interface InterviewSession {
  id: string;
  topic: TopicType;
  difficulty: DifficultyType;
  status: 'in_progress' | 'completed';
  total_questions: number;
  current_question_index: number;
  question?: string;
  scorecard?: Scorecard;
  transcript_turns?: TranscriptTurn[];
}

export interface AdminAnalytics {
  summary: {
    total_users: number;
    interviews_completed: number;
    active_today: number;
    avg_platform_score: number;
  };
  avg_score_by_topic: { topic: string; avg_score: number }[];
  most_common_weak_areas: { area: string; frequency: number }[];
  emotion_distribution: { emotion: string; percentage: number }[];
  daily_activity: { date: string; interviews: number; users: number }[];
}
