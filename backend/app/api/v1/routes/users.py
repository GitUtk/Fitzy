from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.core.database import db
from bson import ObjectId

router = APIRouter()


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user


@router.put("/me")
async def update_profile(profile_data: dict, current_user=Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        # Update user document in mongodb
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "fullName": profile_data.get("fullName"),
                "gender": profile_data.get("gender"),
                "age": profile_data.get("age"),
                "height": profile_data.get("height"),
                "bodyType": profile_data.get("bodyType"),
                "fitPreference": profile_data.get("fitPreference"),
                "budget": profile_data.get("budget"),
                "topSize": profile_data.get("topSize"),
                "bottomSize": profile_data.get("bottomSize"),
                "shoeSize": profile_data.get("shoeSize"),
                "styles": profile_data.get("styles", []),
                "colors": profile_data.get("colors", [])
            }}
        )
        return {"status": "success", "message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))