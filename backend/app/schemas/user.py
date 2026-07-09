from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    gender: str

class UserOut(BaseModel):
    id: str
    email: EmailStr