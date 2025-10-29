# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from dotenv import load_dotenv
# import os

# # Load environment variables
# load_dotenv()

# # Database URL from .env file
# DATABASE_URL = os.getenv("DATABASE_URL")

# if not DATABASE_URL:
#     raise ValueError("DATABASE_URL not set in .env file")

# # SQLAlchemy engine setup
# engine = create_engine(
#     DATABASE_URL,
#     pool_pre_ping=True,
#     echo=True  # Turn off in production
# )

# # Session configuration
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base class for models
# Base = declarative_base()

# # Dependency for DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()





from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Database URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env file")

# Create SQLAlchemy Engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,     # Check connection health automatically
    pool_size=10,           # Max connections in the pool
    max_overflow=20,        # Extra connections if needed
    echo=False              # Set True only for debugging SQL queries
)

# Create Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base Class for ORM Models
Base = declarative_base()


# Database Dependency for FastAPI
def get_db():
    """Provide a database session for each request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
