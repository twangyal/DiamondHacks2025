from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is not set correctly in environment variables or .env file.")


# Set up the database engine
engine = create_engine(DATABASE_URL)

# Create a session local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
import model
model.Base.metadata.create_all(bind=engine)
