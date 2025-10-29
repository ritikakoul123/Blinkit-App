from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Form
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserLogin
from database.connection import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

#CONFIG
SECRET_KEY = os.getenv("SECRET_KEY", "ritika")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Router
router = APIRouter(prefix="/auth", tags=["Auth"])


#HELPER FUNCTIONS

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise credentials_exception
    return user


def send_reset_email(email: str, reset_token: str):
    """Send a password reset email."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Password Reset - Blinkit Clone"
    msg["From"] = smtp_user
    msg["To"] = email

    html_content = f"""
    <html>
      <body>
        <p>Hello,</p>
        <p>We received a request to reset your password for your Blinkit account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_link}" style="background:#00b894;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <br>
        <p>Thank you,<br>Blinkit Support</p>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, email, msg.as_string())


#ROUTES

@router.post("/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    role = db.query(Role).filter(Role.id == user_data.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role_id")

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hashed_password,
        address=user_data.address,
        role_id=user_data.role_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}


@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": user.email,
        "role_id": user.role_id,
        "role_name": user.role.name
    }


@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    """Get details of the currently authenticated user."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role_id": current_user.role_id,
        "role_name": current_user.role.name
    }

@router.post("/forgot-password")
def forgot_password(
    email: str = Form(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Send a password reset link to user's email."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = create_access_token({"sub": user.email}, timedelta(minutes=15))
    background_tasks.add_task(send_reset_email, user.email, reset_token)

    return {"message": "Password reset link sent to your email."}


@router.post("/reset-password")
def reset_password(
    token: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Reset user's password using token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(new_password)
    db.commit()

    return {"message": "Password reset successful!"}

