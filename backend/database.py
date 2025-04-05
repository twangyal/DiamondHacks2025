from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Database URL from environment variables or .env file
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://your_username:your_password@localhost:5432/your_dbname")

# Set up the database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
from . import models
models.Base.metadata.create_all(bind=engine)
