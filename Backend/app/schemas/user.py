from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    address: str
    role_id: Optional[int] = 2  # default role_id=2 (User)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
