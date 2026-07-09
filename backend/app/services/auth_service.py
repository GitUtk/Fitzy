from app.crud.user import get_user_by_email, create_user
from app.core.security import hash_password, verify_password, create_token
from fastapi import HTTPException

async def register_user(email: str, password: str, fullName: str, gender: str):
    existing = await get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    user = {
        "email": email,
        "password": hash_password(password),
        "fullName": fullName,
        "gender": gender
    }

    result = await create_user(user)
    return {"id": str(result.inserted_id), "email": email, "fullName": fullName, "gender": gender}


async def login_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}