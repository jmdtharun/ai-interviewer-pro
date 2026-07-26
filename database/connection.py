import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("ai_interviewer.db")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Establish connection to MongoDB Atlas."""
    logger.info(f"Connecting to MongoDB Atlas database: {settings.DATABASE_NAME}")
    try:
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000
        )
        db_instance.db = db_instance.client[settings.DATABASE_NAME]
        logger.info("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        logger.warning(f"MongoDB connection error: {e}. Fallback to mock memory storage will be available.")

async def close_mongo_connection():
    """Close MongoDB connection pool."""
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """Return current MongoDB database instance."""
    return db_instance.db
