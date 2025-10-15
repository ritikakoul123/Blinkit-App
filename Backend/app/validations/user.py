from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    address: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


