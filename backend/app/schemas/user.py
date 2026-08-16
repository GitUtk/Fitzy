from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    gender: str
    topSize: Optional[str] = None
    bottomSize: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: EmailStr