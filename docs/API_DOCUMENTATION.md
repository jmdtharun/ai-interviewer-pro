# API Documentation — FastAPI Backend

Base API URL: `http://localhost:8000` (Local) or `https://ai-interviewer-backend.onrender.com` (Production)

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new candidate user account.
- **Request Body**:
  ```json
  {
    "email": "candidate@pro.com",
    "full_name": "Alex Mercer",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "access_token": "jwt_token_string",
    "token_type": "bearer",
    "user": { "id": "usr_123", "email": "candidate@pro.com", "role": "candidate" }
  }
  ```

### `POST /auth/login`
Authenticates credentials and issues JWT token.
- **Request Body**:
  ```json
  {
    "email": "candidate@pro.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "jwt_token_string",
    "token_type": "bearer",
    "user": { "id": "usr_123", "email": "candidate@pro.com", "role": "candidate" }
  }
  ```

---

## 2. Interview Flow Endpoints

### `POST /interview/start`
Initializes a new interview session and generates the first question.
- **Request Body**:
  ```json
  {
    "topic": "DSA",
    "difficulty": "Medium",
    "total_questions": 5,
    "user_id": "usr_demo_candidate_123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "interview_id": "int_9821a",
    "topic": "DSA",
    "difficulty": "Medium",
    "current_question_index": 1,
    "total_questions": 5,
    "question": "Can you explain how a Hash Map works under the hood and what collision resolution strategies exist?"
  }
  ```

### `POST /interview/answer`
Submits candidate turn (multipart form with audio and webcam frame).
- **Form Data**:
  - `interview_id`: `int_9821a`
  - `turn_index`: `1`
  - `current_question`: `<question_text>`
  - `user_transcript`: `<optional text transcript override>`
  - `audio_file`: `<WAV/PCM audio file blob>`
  - `webcam_frame`: `<JPEG canvas frame blob>`
- **Response (200 OK)**:
  ```json
  {
    "interview_id": "int_9821a",
    "turn_index": 1,
    "evaluated_score": 85.0,
    "evaluation": "Clear explanation of hash buckets and collision strategies.",
    "next_question": "How would you optimize space complexity when handling heavy load?",
    "is_completed": false,
    "metrics": {
      "eye_contact_score": 84.5,
      "wpm": 142.0,
      "filler_words": 1,
      "dominant_emotion": "confident"
    }
  }
  ```

### `GET /interview/{id}`
Returns interview session state, transcript turns, and scorecard.

### `GET /interview/{id}/report`
Streams or downloads ReportLab generated PDF scorecard.

---

## 3. Analytics Endpoints

### `GET /analytics/user`
Returns candidate performance dashboard metrics.

### `GET /analytics/admin`
Returns platform-wide admin analytics (total users, completed sessions, topic averages, common weak areas, emotion breakdown, daily activity).
