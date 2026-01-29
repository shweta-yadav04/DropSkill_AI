# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select
# from datetime import timedelta

# from database import get_db
# from models.user import User
# from schemas import UserCreate, UserLogin, UserResponse, Token
# from auth import get_password_hash, verify_password, create_access_token, get_current_user
# from config import settings

# router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# @router.post("/register", response_model=UserResponse)
# async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
#     """Register a new seller account"""
#     # Check if email exists
#     result = await db.execute(select(User).where(User.email == user_data.email))
#     if result.scalar_one_or_none():
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )
    
#     # Create user
#     user = User(
#         email=user_data.email,
#         password_hash=get_password_hash(user_data.password),
#         full_name=user_data.full_name,
#         role="seller"
#     )
#     db.add(user)
#     await db.commit()
#     await db.refresh(user)
#     return user

# @router.post("/login", response_model=Token)
# async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
#     """Login and get access token"""
#     result = await db.execute(select(User).where(User.email == credentials.email))
#     user = result.scalar_one_or_none()
    
#     if not user or not verify_password(credentials.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password"
#         )
    
#     if not user.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Account is disabled"
#         )
    
#     access_token = create_access_token(
#         data={"sub": user.id},
#         expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.get("/me", response_model=UserResponse)
# async def get_me(current_user: User = Depends(get_current_user)):
#     """Get current user info"""
#     return current_user

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta

from database import get_db
from models.user import User
from schemas import UserCreate, UserLogin, UserResponse, Token
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ---------------- Register ----------------

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new seller account"""

    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role="seller",
        is_active=True
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


# ---------------- Login ----------------

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login and get access token"""
    result = await db.execute(
        select(User).where(User.email == credentials.email)
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(
        credentials.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is disabled"
        )
    
    # IMPORTANT: sub must be STRING
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------------- Current User ----------------

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user"""
    return current_user