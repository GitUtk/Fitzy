from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.core.database import db
from bson import ObjectId

from datetime import datetime

router = APIRouter()


@router.get("/me")
async def me(user=Depends(get_current_user)):
    user_id = user.get("id")
    # Retrieve purchase history for user
    purchases = await db["purchases"].find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    for p in purchases:
        p["id"] = str(p["_id"])
        del p["_id"]
    user["purchases"] = purchases
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


@router.post("/users/purchases")
async def log_purchase(purchase_data: dict, current_user=Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        bought_size = purchase_data.get("bought_size") or purchase_data.get("size")
        category = purchase_data.get("category", "").lower()
        
        record = {
            "user_id": user_id,
            "product_id": purchase_data.get("product_id", ""),
            "product_title": purchase_data.get("product_title") or purchase_data.get("title", ""),
            "category": purchase_data.get("category", ""),
            "bought_size": bought_size,
            "product_url": purchase_data.get("product_url", ""),
            "created_at": datetime.utcnow().isoformat()
        }
        res = await db["purchases"].insert_one(record)
        
        # Also optionally update standard size preference if category matches top or bottom
        if bought_size:
            set_dict = {}
            if any(c in category for c in ["top", "shirt", "tshirt", "t-shirt", "jacket", "hoodie", "sweater"]):
                set_dict["topSize"] = bought_size
            elif any(c in category for c in ["bottom", "pant", "trouser", "jean", "short", "skirt"]):
                set_dict["bottomSize"] = bought_size
            
            if set_dict:
                await db["users"].update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": set_dict}
                )
                
        return {"status": "success", "id": str(res.inserted_id), "purchase": record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/purchases")
async def get_purchases(current_user=Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        purchases = await db["purchases"].find({"user_id": user_id}).sort("created_at", -1).to_list(100)
        for p in purchases:
            p["id"] = str(p["_id"])
            del p["_id"]
        return purchases
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))