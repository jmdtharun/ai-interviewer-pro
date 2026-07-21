import sys
import os
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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
    description="Production AI Interviewer SaaS Backend",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving
if os.path.exists(settings.REPORTS_DIR):
    app.mount("/reports", StaticFiles(directory=settings.REPORTS_DIR), name="reports")

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(interview.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health"])
async def root():
    """Root health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
