import base64
from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from app.api.deps import get_current_user
from app.core.database import db
from app.services.cloudinary_service import upload_image_to_cloudinary
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/image")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type
        secure_url = f"data:{mime_type};base64,{base64_data}"
        
        return {
            "secure_url": secure_url,
            "public_id": "local_data_uri",
            "is_mock": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/url")
async def save_image_url(payload: dict = Body(...), current_user: dict = Depends(get_current_user)):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
        
    user_id = current_user["id"]
    
    look = {
        "user_id": user_id,
        "image_url": url,
        "created_at": datetime.utcnow()
    }
    
    result = await db["looks"].insert_one(look)
    look["id"] = str(result.inserted_id)
    look["_id"] = str(result.inserted_id)
    
    await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"uploaded_images": url}}
    )
    
    return {"status": "success", "look": look}

@router.get("/looks")
async def get_user_looks(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    cursor = db["looks"].find({"user_id": user_id}).sort("created_at", -1)
    looks = await cursor.to_list(length=100)
    for look in looks:
        look["id"] = str(look["_id"])
        look["_id"] = str(look["_id"])
        if isinstance(look.get("created_at"), datetime):
            look["created_at"] = look["created_at"].isoformat()
    return looks
