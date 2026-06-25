from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.api.deps import get_current_user
from app.services.recommendation_service import recommendation_service

router = APIRouter()

@router.post("/similar")
async def get_similar_outfits(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        file_bytes = await file.read()
        results = recommendation_service.find_similar(file_bytes)
        return {"success": True, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
