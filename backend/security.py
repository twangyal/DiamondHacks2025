# security.py
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from schemas import TokenData
from fastapi import HTTPException, Header
import os
from jwt import PyJWTError as JWTError
from typing import Optional


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15)  # Default to 15 minutes if not set

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(authorization: Optional[str] = Header(None)) -> TokenData:
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise JWTError
        return TokenData(username=username)
    except JWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")