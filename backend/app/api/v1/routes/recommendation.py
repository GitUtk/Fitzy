import base64
import httpx
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.api.deps import get_current_user
from app.services.recommendation_service import recommendation_service
from app.core.config import GEMINI_API_KEY

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

@router.post("/analyze")
async def analyze_outfit_style(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is not configured on the backend environment."
        )

    try:
        # Read file bytes and encode to base64
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type

        # Build prompt for brutally honest styling assessment
        prompt = (
            "You are an elite, raw, and brutally honest fashion critic and personal stylist. "
            "Your goal is to analyze the person's outfit, sizing, fit, color matching, and styling choices in the provided image. "
            "Provide a detailed fashion critique WITHOUT any sugar-coating or polite fluff. If a choice is bad, say it is bad. "
            "Be direct, sharp, and brutally honest. Structure your response in clean markdown format with the following headers:\n\n"
            "### 1. The Brutal First Impression\n"
            "A short, sharp, unfiltered summary of what you see.\n\n"
            "### 2. What's Decent (If Anything)\n"
            "Highlight what actually works or has potential (if anything at all).\n\n"
            "### 3. The Fashion Disasters\n"
            "Point out all styling errors, poor fits, mismatching elements, or clashing colors.\n\n"
            "### 4. Style Prescription\n"
            "Clear, actionable styling recommendations to instantly level up this exact look (e.g., fit adjustments, color swaps, matching pieces, accessories, footwear)."
        )

        # Make async request to Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": base64_data
                            }
                        }
                    ]
                }
            ]
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Gemini API returned an error: {response.text}"
                )
            
            response_json = response.json()
            
            # Parse text response from Gemini candidates
            try:
                analysis_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError):
                raise HTTPException(
                    status_code=502,
                    detail="Failed to parse analysis results from Gemini API response."
                )

            return {
                "success": True,
                "analysis": analysis_text
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal error processing image style analysis: {str(e)}"
        )
