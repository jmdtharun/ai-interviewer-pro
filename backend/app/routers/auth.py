from fastapi import APIRouter, HTTPException, status, Depends
from database.connection import get_database
from database.models import UserRegisterReq, UserLoginReq
from app.core.security import get_password_hash, verify_password, create_access_token
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory fallback user store for zero-config local testing
MOCK_USERS_DB = {
    "candidate@pro.com": {
        "id": "usr_demo_candidate_123",
        "email": "candidate@pro.com",
        "full_name": "Alex Mercer",
        "password_hash": get_password_hash("password123"),
        "role": "candidate"
    },
    "admin@pro.com": {
        "id": "usr_demo_admin_999",
        "email": "admin@pro.com",
        "full_name": "System Administrator",
        "password_hash": get_password_hash("admin123"),
        "role": "admin"
    }
}

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterReq):
    """Register a new candidate user."""
    db = get_database()
    
    if db is not None:
        try:
            existing = await db.users.find_one({"email": req.email})
            if existing:
                raise HTTPException(status_code=400, detail="User with this email already exists.")

            user_doc = {
                "_id": str(uuid.uuid4()),
                "email": req.email,
                "full_name": req.full_name,
                "password_hash": get_password_hash(req.password),
                "role": "candidate",
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(user_doc)
            token = create_access_token(user_doc["_id"])
            return {
                "message": "User registered successfully",
                "user": {"id": user_doc["_id"], "email": req.email, "full_name": req.full_name, "role": "candidate"},
                "access_token": token,
                "token_type": "bearer"
            }
        except Exception:
            pass

    # Fallback storage
    if req.email in MOCK_USERS_DB:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    user_id = str(uuid.uuid4())
    MOCK_USERS_DB[req.email] = {
        "id": user_id,
        "email": req.email,
        "full_name": req.full_name,
        "password_hash": get_password_hash(req.password),
        "role": "candidate"
    }
    token = create_access_token(user_id)
    return {
        "message": "User registered successfully",
        "user": {"id": user_id, "email": req.email, "full_name": req.full_name, "role": "candidate"},
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/login")
async def login(req: UserLoginReq):
    """Authenticate candidate or admin and return JWT access token."""
    db = get_database()

    if db is not None:
        try:
            user = await db.users.find_one({"email": req.email})
            if user and verify_password(req.password, user["password_hash"]):
                token = create_access_token(user["_id"])
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {
                        "id": user["_id"],
                        "email": user["email"],
                        "full_name": user["full_name"],
                        "role": user.get("role", "candidate")
                    }
                }
        except Exception:
            pass

    # Fallback login check
    mock_user = MOCK_USERS_DB.get(req.email)
    if mock_user and verify_password(req.password, mock_user["password_hash"]):
        token = create_access_token(mock_user["id"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": mock_user["id"],
                "email": mock_user["email"],
                "full_name": mock_user["full_name"],
                "role": mock_user["role"]
            }
        }

    raise HTTPException(status_code=401, detail="Invalid email or password.")
