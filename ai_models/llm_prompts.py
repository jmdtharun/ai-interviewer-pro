import json
import logging
from typing import Dict, Any, List
try:
    import openai
except ImportError:
    openai = None
from app.config import settings

logger = logging.getLogger("ai_interviewer.llm")

# System Prompts
TECHNICAL_INTERVIEWER_PROMPT = """You are an elite Senior Staff Engineer interviewing a candidate for a Tier-1 tech placement role.
Topic: {topic} | Target Difficulty: {difficulty}

Core Guidelines:
1. Ask clear, real-world technical placement interview questions.
2. Adaptively adjust difficulty: If candidate's previous score >= 75%, ask a harder, deeper question (e.g. edge cases, space complexity, concurrency). If < 50%, ask a supportive, foundational follow-up question.
3. Never reveal the complete answer directly in follow-up turns.
4. Provide constructive evaluation and score (0-100) for every turn.
"""

HR_INTERVIEWER_PROMPT = """You are a Principal Talent Specialist conducting a behavioral and HR placement interview.
Target Difficulty: {difficulty}

Core Guidelines:
1. Focus on STAR method (Situation, Task, Action, Result), leadership, adaptability, conflict resolution, and career motivation.
2. Adaptively probe deeper into candidate's specifics: If previous response is vague or weak, ask for concrete examples.
3. Maintain an encouraging yet professional tone.
"""

ADAPTIVE_FOLLOWUP_PROMPT = """Given the interview context and candidate's latest answer, evaluate performance and generate the next adaptive follow-up question.

Context:
Topic: {topic}
Current Turn: {turn_number}
Previous Question: {previous_question}
Candidate Answer: {candidate_answer}
Previous Score: {previous_score}

Return JSON with:
{{
    "score": <0-100 float>,
    "evaluation": "<2-3 sentence technical critique>",
    "next_question": "<the next adaptive question or follow-up>",
    "difficulty": "<Easy | Medium | Hard>",
    "hint": "<short optional hint if score < 60>"
}}
"""

HINT_GENERATION_PROMPT = """Provide a concise, subtle hint for the following question without giving away the complete solution:
Question: {question}
Candidate's Struggling Response: {candidate_answer}
"""

FINAL_FEEDBACK_PROMPT = """Generate a comprehensive candidate placement evaluation report based on the full transcript.
Transcript: {transcript_summary}
Scores: {score_summary}

Return JSON with:
{{
    "technical_accuracy": <0-100 float>,
    "problem_solving": <0-100 float>,
    "overall_summary": "<paragraph summary>",
    "top_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "areas_for_improvement": ["<area 1>", "<area 2>", "<area 3>"],
    "recommended_topics": ["<topic 1>", "<topic 2>"]
}}
"""


class LLMPipeline:
    """OpenAI GPT-4o / GPT-4.1 Pipeline with Adaptive Question Engine & Local Fallback."""

    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY

    async def generate_first_question(self, topic: str, difficulty: str) -> str:
        """Generate initial question based on topic and difficulty."""
        prompt = f"Generate a compelling first placement interview question for topic '{topic}' at '{difficulty}' difficulty."
        
        if settings.OPENAI_API_KEY:
            try:
                response = await openai.ChatCompletion.acreate(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": TECHNICAL_INTERVIEWER_PROMPT.format(topic=topic, difficulty=difficulty)},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=250
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.warning(f"OpenAI call failed, using fallback question: {e}")

        # Intelligent Fallback Questions
        fallback_questions = {
            "DSA": {
                "Easy": "Can you explain how a Hash Map works under the hood and what collision resolution strategies exist?",
                "Medium": "How would you find the longest palindromic substring in O(N^2) or O(N) time complexity?",
                "Hard": "Design an LRU Cache with O(1) time complexity for both get() and put() operations using doubly linked lists."
            },
            "DBMS": {
                "Easy": "Explain ACID properties in relational databases and how atomicity is enforced.",
                "Medium": "What is the difference between B-Trees and B+ Trees in database indexing?",
                "Hard": "How does multi-version concurrency control (MVCC) work in PostgreSQL or MySQL InnoDB?"
            },
            "OOP": {
                "Easy": "What are the four core pillars of Object-Oriented Programming? Give real-world examples.",
                "Medium": "Explain the SOLID principles with emphasis on Dependency Inversion.",
                "Hard": "Design a thread-safe Singleton pattern in C++ or Python handling double-checked locking."
            },
            "OS": {
                "Easy": "What is the difference between a process and a thread? How is context switching managed?",
                "Medium": "Explain Virtual Memory and how page faults are handled by the OS kernel.",
                "Hard": "How would you solve the Dining Philosophers synchronization problem avoiding deadlock and starvation?"
            },
            "CN": {
                "Easy": "Explain the 3-way handshake process in TCP connection establishment.",
                "Medium": "Compare HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC protocol).",
                "Hard": "How does DNS resolution work end-to-end, including recursive and iterative queries?"
            },
            "HR": {
                "Easy": "Tell me about a challenging group project you worked on and how you resolved team disagreements.",
                "Medium": "Describe a time when a critical bug occurred in production right before deadline. How did you react?",
                "Hard": "Where do you see your technical leadership in 3 to 5 years, and how does this company align with that vision?"
            }
        }
        
        topic_dict = fallback_questions.get(topic.upper(), fallback_questions["DSA"])
        return topic_dict.get(difficulty.capitalize(), topic_dict["Medium"])

    async def evaluate_answer_and_next_question(
        self,
        topic: str,
        turn_number: int,
        previous_question: str,
        candidate_answer: str,
        previous_score: float = 75.0
    ) -> Dict[str, Any]:
        """Evaluate candidate answer and generate adaptive follow-up."""
        
        if settings.OPENAI_API_KEY:
            try:
                system_p = TECHNICAL_INTERVIEWER_PROMPT.format(topic=topic, difficulty="Adaptive")
                user_p = ADAPTIVE_FOLLOWUP_PROMPT.format(
                    topic=topic,
                    turn_number=turn_number,
                    previous_question=previous_question,
                    candidate_answer=candidate_answer,
                    previous_score=previous_score
                )

                response = await openai.ChatCompletion.acreate(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": system_p},
                        {"role": "user", "content": user_p}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.6,
                    max_tokens=400
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.warning(f"OpenAI adaptive evaluation failed, using fallback rule engine: {e}")

        # Local Adaptive Rule Engine
        answer_length = len(candidate_answer.split())
        if answer_length > 25:
            score = 85.0 if previous_score >= 70 else 75.0
            next_diff = "Hard" if score >= 80 else "Medium"
            eval_txt = "Good response covering key technical aspects and trade-offs clearly."
            if topic.upper() == "DSA":
                next_q = "Excellent analysis! Now how would you optimize the memory footprint if the input dataset does not fit into RAM?"
            elif topic.upper() == "DBMS":
                next_q = "Spot on! How does database indexing affect write performance in high-throughput applications?"
            else:
                next_q = f"Great insight. Moving forward in {topic}, how would you test and monitor this system under heavy concurrent load?"
        else:
            score = 55.0
            next_diff = "Easy"
            eval_txt = "The response was brief. Adding specific algorithm choices or system trade-offs would strengthen the answer."
            next_q = "Could you walk me step-by-step through a concrete code example or scenario for this concept?"

        return {
            "score": score,
            "evaluation": eval_txt,
            "next_question": next_q,
            "difficulty": next_diff,
            "hint": "Consider focusing on space-time trade-offs and edge cases." if score < 60 else None
        }

    async def generate_hint(self, question: str, candidate_answer: str) -> str:
        """Generate subtle hint for struggling candidate."""
        if settings.OPENAI_API_KEY:
            try:
                response = await openai.ChatCompletion.acreate(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "user", "content": HINT_GENERATION_PROMPT.format(question=question, candidate_answer=candidate_answer)}
                    ],
                    temperature=0.5,
                    max_tokens=100
                )
                return response.choices[0].message.content.strip()
            except Exception:
                pass

        return "Hint: Think about using auxiliary data structures like stacks or two-pointers to reduce nested loop overhead."

llm_engine = LLMPipeline()
