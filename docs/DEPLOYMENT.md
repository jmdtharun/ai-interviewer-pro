# Production Deployment Guide — Render, Vercel & Docker

This guide details step-by-step instructions for deploying AI Interviewer Pro to production infrastructure.

---

## 1. Local & Production Docker Deployment

### Single Command Container Stack:
Run from project root directory:
```bash
docker-compose up --build -d
```

Verify running containers:
```bash
docker-compose ps
```
- Frontend Web App: `http://localhost:3000`
- FastAPI Backend: `http://localhost:8000`
- MongoDB Database: `mongodb://localhost:27017`

---

## 2. Backend Deployment on Render

### Step 1: Connect Repository to Render
1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository containing `render.yaml`.
4. Render will automatically detect `ai-interviewer-backend`.

### Step 2: Environment Variables Configuration
In Render Web Service settings, set the following environment variables:
- `ENVIRONMENT`: `production`
- `DATABASE_NAME`: `ai_interviewer_db`
- `MONGODB_URI`: `mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/ai_interviewer_db`
- `SECRET_KEY`: `super-secret-key-ai-interviewer-pro-2026`
- `OPENAI_API_KEY`: `sk-proj-your-openai-api-key`
- `CLOUDINARY_CLOUD_NAME`: `your-cloud-name`
- `CLOUDINARY_API_KEY`: `your-cloudinary-api-key`
- `CLOUDINARY_API_SECRET`: `your-cloudinary-api-secret`

### Step 3: Start Command & Build Verification
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

---

## 3. Frontend Deployment on Vercel

### Step 1: Deploy to Vercel
1. Install Vercel CLI (optional) or import repository on [Vercel Dashboard](https://vercel.com).
   ```bash
   npm install -g vercel
   vercel --prod
   ```
2. Select Root Directory as repository root or `frontend`.

### Step 2: Vercel Environment Variables
Set the following environment variables in Vercel project settings:
- `NEXT_PUBLIC_API_URL`: `https://ai-interviewer-backend.onrender.com`
- `NEXTAUTH_SECRET`: `super-secret-nextauth-key-2026`
- `NEXTAUTH_URL`: `https://ai-interviewer-pro.vercel.app`

`vercel.json` automatically configures the Next.js build output directory.
