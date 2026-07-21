# Database Schema & Entity Diagram — MongoDB Atlas

AI Interviewer Pro uses MongoDB Atlas with 6 primary collections.

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ INTERVIEWS : conducts
    INTERVIEWS ||--|| TRANSCRIPTS : records
    INTERVIEWS ||--|| SCORES : generates
    INTERVIEWS ||--|| ANALYTICS : collects
    INTERVIEWS ||--|| REPORTS : exports

    USERS {
        string _id PK
        string email UK
        string full_name
        string password_hash
        string role
        date created_at
    }

    INTERVIEWS {
        string _id PK
        string user_id FK
        string topic
        string difficulty
        string status
        int total_questions
        date created_at
    }

    TRANSCRIPTS {
        string _id PK
        string interview_id FK
        string user_id FK
        array turns
        date updated_at
    }

    SCORES {
        string _id PK
        string interview_id FK
        float total_score
        float technical_accuracy
        float problem_solving
        float communication
        float confidence
        float professionalism
        array feedback_summary
    }

    ANALYTICS {
        string _id PK
        string interview_id FK
        float avg_wpm
        int total_filler_words
        float avg_eye_contact
        string dominant_emotion
    }

    REPORTS {
        string _id PK
        string interview_id FK
        string pdf_url
        int download_count
    }
```

---

## MongoDB Collections Detail

1. **`users`**: Stores user authentication credentials, hashed passwords, and roles (`candidate` or `admin`).
2. **`interviews`**: Tracks session parameters (Topic: DSA, DBMS, OOP, OS, CN, HR; Difficulty: Easy, Medium, Hard).
3. **`transcripts`**: Stores sequential turn-by-turn logs including AI questions, candidate responses, turn scores, and evaluation comments.
4. **`scores`**: Stores final weighted scorecard output (40% Technical, 20% Problem Solving, 20% Communication, 10% Confidence, 10% Professionalism).
5. **`analytics`**: Stores aggregate speech and vision metrics across candidate sessions.
6. **`reports`**: Stores generated ReportLab PDF URLs and download metrics.
