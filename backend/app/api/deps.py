from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token
from app.crud.user import get_user_by_email
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")
    user = await get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"email": user["email"], "id": str(user["_id"])}