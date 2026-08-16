from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth_service import register_user, login_user
from app.schemas.user import UserCreate

router = APIRouter()


@router.post("/register")
async def register(user: UserCreate):
    return await register_user(
        email=user.email,
        password=user.password,
        fullName=user.fullName,
        gender=user.gender,
        topSize=user.topSize,
        bottomSize=user.bottomSize
    )


@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    return await login_user(form.username, form.password)