const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error ${response.status}`);
  }

  return response.json();
}

export async function startInterviewSession(topic: string, difficulty: string, totalQuestions = 5) {
  return apiFetch<{
    interview_id: string;
    topic: string;
    difficulty: string;
    current_question_index: number;
    total_questions: number;
    question: string;
  }>('/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      difficulty,
      total_questions: totalQuestions,
      user_id: 'usr_demo_candidate_123',
    }),
  });
}

export async function submitInterviewTurn(formData: FormData) {
  return apiFetch<{
    interview_id: string;
    turn_index: number;
    evaluated_score: number;
    evaluation: string;
    next_question: string | null;
    is_completed: boolean;
    metrics: any;
    scorecard: any;
    pdf_available: boolean;
  }>('/interview/answer', {
    method: 'POST',
    body: formData,
  });
}

export async function getInterviewDetails(interviewId: string) {
  return apiFetch<any>(`/interview/${interviewId}`);
}

export async function getCandidateAnalytics() {
  return apiFetch<any>('/analytics/user');
}

export async function getAdminAnalytics() {
  return apiFetch<any>('/analytics/admin');
}

export function getReportDownloadUrl(interviewId: string): string {
  return `${API_BASE_URL}/interview/${interviewId}/report`;
}
