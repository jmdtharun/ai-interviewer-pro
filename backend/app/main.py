import sys
import os
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from database.connection import connect_to_mongo, close_mongo_connection
from app.routers import auth, interview, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for MongoDB connection setup & cleanup."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Production AI Interviewer SaaS Single-Server Stack",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(interview.router)
app.include_router(analytics.router)

# Mount Report & Upload Files
if os.path.exists(settings.REPORTS_DIR):
    app.mount("/reports", StaticFiles(directory=settings.REPORTS_DIR), name="reports")

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

# All-in-One Frontend Static Mount (Serves Next.js UI on single port)
frontend_out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "out")
if not os.path.exists(frontend_out_dir):
    frontend_out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "out")

if os.path.exists(frontend_out_dir):
    app.mount("/", StaticFiles(directory=frontend_out_dir, html=True), name="frontend")
else:
    @app.get("/", tags=["Frontend Fallback"])
    async def index_fallback():
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "message": "API active. Build frontend static export to serve single-server web UI."
        }
