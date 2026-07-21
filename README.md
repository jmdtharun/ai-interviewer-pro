# AI Interviewer Pro — Production AI Placement Simulation Platform

AI Interviewer Pro is a production-ready, AI-driven placement-interview simulation platform. Candidates take technical & HR placement interviews using voice and webcam, receive adaptive follow-up questions from an LLM, get real-time vision/speech cognitive analysis, and download detailed ReportLab PDF scorecards.

---

## Deliverables Checklist & Key Links

- [x] **Full Source Code**: Complete frontend, backend, AI pipeline, services, database schemas, Docker, and CI/CD.
- [x] **Architecture Diagram**: Documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- [x] **Database Diagram**: Documented in [docs/DATABASE.md](docs/DATABASE.md).
- [x] **API Documentation**: Detailed in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).
- [x] **Local Setup Commands**: Covered below in Quickstart.
- [x] **Docker Setup**: Provided in `docker-compose.yml` and `docker/`.
- [x] **Render Deployment Steps**: Documented in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and `render.yaml`.
- [x] **Vercel Deployment Steps**: Configured in `vercel.json`.
- [x] **Sample Environment Variables**: Documented in `.env.example`.
- [x] **Demo User Credentials**: Detailed below.
- [x] **Example Interview Transcript**: Included below.
- [x] **Example Generated PDF Report**: Available via `GET /interview/{id}/report`.

---

## Technical Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, WebRTC Media Stream
- **Backend**: FastAPI (Python 3.11), Uvicorn, Pydantic v2, PyJWT, Async Motor
- **AI / ML Pipeline**:
  - `faster-whisper` (Speech-to-Text)
  - `OpenAI GPT-4o / GPT-4.1` (Adaptive interviewer prompts & fallback engine)
  - `OpenCV` & `MediaPipe Face Mesh` (Eye contact, 3D head pose stability, smile score, engagement)
  - Audio processing (WPM, filler word parsing, pause duration, voice RMS energy)
- **Database**: MongoDB Atlas
- **PDF Scorecard Reports**: ReportLab
- **DevOps**: Docker, docker-compose, Nginx, GitHub Actions CI, Render, Vercel

---

## Weighted Scoring Engine (100 Points Total)

$$\text{Final Score} = (\text{Technical Accuracy} \times 0.40) + (\text{Problem Solving} \times 0.20) + (\text{Communication} \times 0.20) + (\text{Confidence} \times 0.10) + (\text{Professionalism} \times 0.10)$$

---

## Demo Credentials

- **Candidate User**:
  - Email: `candidate@pro.com`
  - Password: `password123`
- **System Admin User**:
  - Email: `admin@pro.com`
  - Password: `admin123`

---

## Local Setup & Quickstart

### Option 1: Run with Single Docker-Compose Command (Recommended)
```bash
# Clone and enter repository
git clone https://github.com/your-org/ai-interviewer-pro.git
cd ai-interviewer-pro

# Launch single-command local stack
docker-compose up --build
```
Access points:
- Frontend Web Application: `http://localhost:3000`
- FastAPI Backend & Swagger Docs: `http://localhost:8000/docs`
- MongoDB: `mongodb://localhost:27017`

### Option 2: Run Backend and Frontend Manually

#### 1. Backend Setup:
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run FastAPI dev server
uvicorn backend.app.main:app --reload --port 8000
```

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

---

## Running Automated Backend Tests

```bash
# Run pytest test suite
pytest
```

---

## Example Interview Transcript Log

```
[AI Senior Technical Interviewer]
Q1 (DSA - Medium): "Can you explain how a Hash Map works under the hood and what collision resolution strategies exist?"

[Candidate Response - Voice Transcribed via Whisper]
"A Hash map uses a hash function to map keys to bucket array indices. Collisions are resolved via chaining (using linked lists or trees) or open addressing (linear probing, quadratic probing, double hashing)."

[AI Cognitive Analytics]
- Technical Accuracy Score: 88.0 / 100
- Eye Contact Score: 85.2%
- Speaking Pace: 142.0 WPM
- Filler Words Detected: 1 ("like")
- Dominant Emotion: Confident
- AI Critique: "Clear explanation of hash buckets and collision strategies."

[Adaptive LLM Follow-Up]
Q2 (DSA - Hard): "Spot on! Now how would you optimize the memory footprint if the input dataset does not fit into RAM?"
```

---

## Example PDF Scorecard Download

PDF reports are automatically rendered using ReportLab upon completing an interview.
- **Endpoint**: `GET /interview/{id}/report`
- **Sample File**: Generates `reports/interview_report_{id}.pdf` featuring metadata, 5-metric score summary table, qualitative feedback bullet points, and Q&A log.

---

## Production Deployment Commands

### Backend (Render):
- **Blueprint Spec**: `render.yaml`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel):
- **Vercel Config**: `vercel.json`
- **Build Command**: `cd frontend && npm run build`

---

## Final Production Readiness Checklist

- [x] Decoupled Next.js 15 App Router & FastAPI architecture.
- [x] MediaPipe Face Mesh & OpenCV vision pipeline integrated.
- [x] Speech-to-Text audio processor with WPM, filler word parsing, and energy analysis.
- [x] OpenAI GPT-4o adaptive follow-up pipeline with robust fallback engine.
- [x] Weighted 5-metric placement scoring engine (40/20/20/10/10).
- [x] ReportLab PDF scorecard generator & Cloudinary / local file storage handler.
- [x] Candidate history dashboard & Admin analytics dashboard with Recharts.
- [x] Dockerfile (backend/frontend), `docker-compose.yml`, `nginx.conf`.
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- [x] Render deployment blueprint (`render.yaml`) and Vercel configuration (`vercel.json`).
- [x] All backend unit & integration tests passing via `pytest`.
