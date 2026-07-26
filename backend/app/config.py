import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Interviewer Pro"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # JWT Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-ai-interviewer-pro-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "ai_interviewer_db")
    
    # OpenAI & LLM Pipeline
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    LLM_FALLBACK_MODE: bool = os.getenv("LLM_FALLBACK_MODE", "true").lower() == "true"
    
    # Cloudinary File Storage
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # Storage Directory
    REPORTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
