import base64
import json
import httpx
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body
from app.api.deps import get_current_user
from app.services.recommendation_service import recommendation_service
from app.services.tryon_service import tryon_service
from app.services.cloudinary_service import upload_image_to_cloudinary
from app.core.config import GEMINI_API_KEY
from app.core.database import db

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
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_outfit_style(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    try:
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type
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
                raise HTTPException(status_code=response.status_code, detail=response.text)
            response_json = response.json()
            analysis_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
            return {"success": True, "analysis": analysis_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-metadata")
async def extract_clothing_metadata(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    try:
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type
        
        prompt = (
            "You are Fitzy's clothing metadata extractor.\n\n"
            "Analyze the uploaded clothing item.\n\n"
            "Return ONLY valid JSON.\n\n"
            "Do not explain anything.\n\n"
            "If a field is unknown, return null.\n\n"
            "Use exactly this schema.\n\n"
            "{\n"
            "    \"category\":\"\",\n"
            "    \"subcategory\":\"\",\n"
            "    \"primaryColor\":\"\",\n"
            "    \"secondaryColor\":\"\",\n"
            "    \"pattern\":\"\",\n"
            "    \"material\":\"\",\n"
            "    \"fit\":\"\",\n"
            "    \"style\":[],\n"
            "    \"season\":[],\n"
            "    \"occasion\":[],\n"
            "    \"confidence\":0\n"
            "}"
        )
        
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
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            response_json = response.json()
            raw_text = response_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()
            
            metadata = json.loads(raw_text)
            return {"success": True, "metadata": metadata}
    except json.JSONDecodeError as je:
        raise HTTPException(status_code=520, detail=f"Failed to parse metadata from Gemini response: {str(je)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stylist")
async def virtual_stylist(
    file: UploadFile = File(...),
    prompt: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    try:
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type
        user_image_url = f"data:{mime_type};base64,{base64_data}"
        
        gemini_prompt = (
            f"You are a professional fashion stylist. Analyze the user's appearance in the image and their requested style prompt: '{prompt}'. "
            "Suggest a coordinated outfit consisting of 1-3 items (e.g. a top, a bottom, footwear) from these specific categories: 'Shirts', 'T-Shirts | POLO', 'Jeans', 'Trousers', 'Footwear'. "
            "Return a JSON object with the following structure. Do not include markdown formatting like ```json or ``` in the output, return ONLY the raw JSON string:\n"
            "{\n"
            "  \"critique\": \"Your professional critique of their current outfit and how it relates to their request.\",\n"
            "  \"advice\": \"General advice on how they can pull off this style.\",\n"
            "  \"recommendations\": [\n"
            "    {\n"
            "      \"category\": \"Shirts\",\n"
            "      \"search_query\": \"keywords to search in a fashion catalog (e.g., 'White Linen Shirt')\",\n"
            "      \"reason\": \"Why this item is recommended.\"\n"
            "    }\n"
            "  ]\n"
            "}"
        )
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": gemini_prompt},
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
                raise HTTPException(status_code=response.status_code, detail=response.text)
            response_json = response.json()
            raw_text = response_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()
            
            stylist_data = json.loads(raw_text)
            
            final_recommendations = []
            for rec in stylist_data.get("recommendations", []):
                category = rec.get("category")
                query = rec.get("search_query")
                matched_products = recommendation_service.search_products(query, category, limit=3)
                final_recommendations.append({
                    "category": category,
                    "reason": rec.get("reason"),
                    "search_query": query,
                    "products": matched_products
                })
            
            return {
                "success": True,
                "user_image_url": user_image_url,
                "critique": stylist_data.get("critique"),
                "advice": stylist_data.get("advice"),
                "recommendations": final_recommendations
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fetchGradio")
async def fetch_gradio(payload: dict = Body(...)):
    url = payload.get("gradio_url")
    if not url:
        raise HTTPException(status_code=400, detail="gradio_url is required")
    # Save the link in mongodb database, keeping a single entry only
    await db["gradio_config"].delete_many({})
    await db["gradio_config"].insert_one({
        "gradio_url": url.rstrip("/"),
        "created_at": datetime.utcnow()
    })
    return {"status": "success", "gradio_url": url.rstrip("/")}

@router.post("/tryon")
async def virtual_tryon(
    garment_url: str = Form(...),
    category: str = Form("tops"),
    file: UploadFile = File(None),
    person_url: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        if file:
            if not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
            person_bytes = await file.read()
        elif person_url:
            person_bytes = await tryon_service.download_image(person_url)
        else:
            raise HTTPException(status_code=400, detail="Either a file upload or person_url must be provided.")
        
        tryon_image_url = await tryon_service.generate_tryon(person_bytes, garment_url, category)
        
        user_id = current_user["id"]
        look = {
            "user_id": user_id,
            "image_url": tryon_image_url,
            "created_at": datetime.utcnow()
        }
        await db["looks"].insert_one(look)
        
        return {"success": True, "tryon_image_url": tryon_image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
