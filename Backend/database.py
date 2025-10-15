from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  #  mysql+pymysql://root:password@localhost/blinkit_db

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env file")

# SQLAlchemy engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# FastAPI DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


