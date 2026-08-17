import base64
import json
import httpx
from datetime import datetime
from bson import ObjectId
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

@router.post("/extract-metadata")
async def extract_clothing_metadata(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    try:
        file_bytes = await file.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        mime_type = file.content_type

        prompt = (
            "You are a clothing metadata extraction expert. Analyze the provided image of a clothing item "
            "(or a person wearing clothing) and extract structured metadata. "
            "Return ONLY a raw JSON object — no markdown, no code fences, no extra text. "
            "Use exactly this structure:\n"
            "{\n"
            '  "category": "<one of: Shirts, T-Shirts, Jeans, Trousers, Dresses, Outerwear, Shoes, Accessories, Shorts, Skirts, Activewear, Ethnic Wear, Lingerie, Swimwear>",\n'
            '  "subcategory": "<specific subcategory, e.g. Casual Shirts, Slim Fit Jeans, etc.>",\n'
            '  "primaryColor": "<dominant color name>",\n'
            '  "secondaryColor": "<second color name or null>",\n'
            '  "pattern": "<e.g. Plain, Striped, Checked, Floral, Graphic, etc.>",\n'
            '  "material": "<e.g. Cotton, Linen, Polyester, Denim, Wool, etc. or null if unclear>",\n'
            '  "fit": "<e.g. Regular, Slim, Oversized, Relaxed, Fitted, etc.>",\n'
            '  "style": ["<style tag 1>", "<style tag 2>"],\n'
            '  "season": ["<season 1>", "<season 2>"],\n'
            '  "occasion": ["<occasion 1>", "<occasion 2>"],\n'
            '  "confidence": <float between 0.0 and 1.0>\n'
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
            ]
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)

            response_json = response.json()
            raw_text = response_json["candidates"][0]["content"]["parts"][0]["text"].strip()

            # Strip markdown code fences if present
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                lines = lines[1:] if lines[0].startswith("```") else lines
                lines = lines[:-1] if lines and lines[-1].startswith("```") else lines
                raw_text = "\n".join(lines).strip()

            try:
                metadata = json.loads(raw_text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=520, detail="Failed to parse metadata from Gemini response")

            return {"success": True, "metadata": metadata}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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


@router.get("/wardrobe")
async def get_wardrobe(current_user: dict = Depends(get_current_user)):
    try:
        cursor = db["clothing_metadata"].find({"user_id": current_user["id"]}).sort("created_at", -1)
        items = await cursor.to_list(length=500)
        
        result = []
        for item in items:
            result.append({
                "id": str(item["_id"]),
                "src": item.get("image_url"),
                "name": item.get("name"),
                "category": item.get("category"),
                "metadata": item.get("metadata"),
                "addedAt": item.get("created_at").isoformat() if isinstance(item.get("created_at"), datetime) else item.get("created_at")
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/wardrobe")
async def add_wardrobe_item(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: str = Form(...),
    metadata: str = Form(...),  # JSON-serialized metadata
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    try:
        file_bytes = await file.read()
        
        # Upload image to Cloudinary to get persistent URL
        upload_res = await upload_image_to_cloudinary(file_bytes)
        image_url = upload_res.get("secure_url")
        
        # Parse the JSON string
        try:
            parsed_metadata = json.loads(metadata) if metadata else {}
        except json.JSONDecodeError:
            parsed_metadata = {}
            
        # Store in MongoDB
        metadata_doc = {
            "user_id": current_user["id"],
            "name": name,
            "category": category,
            "image_url": image_url,
            "metadata": parsed_metadata,
            "created_at": datetime.utcnow()
        }
        await db["clothing_metadata"].insert_one(metadata_doc)
        
        return {
            "id": str(metadata_doc["_id"]),
            "src": image_url,
            "name": name,
            "category": category,
            "metadata": parsed_metadata,
            "addedAt": metadata_doc["created_at"].isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/wardrobe/{item_id}")
async def update_wardrobe_item(
    item_id: str,
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        update_data = {}
        if "name" in payload:
            update_data["name"] = payload["name"]
        if "category" in payload:
            update_data["category"] = payload["category"]
            
        if not update_data:
            return {"success": True}
            
        result = await db["clothing_metadata"].update_one(
            {"_id": ObjectId(item_id), "user_id": current_user["id"]},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/wardrobe/{item_id}")
async def delete_wardrobe_item(
    item_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = await db["clothing_metadata"].delete_one(
            {"_id": ObjectId(item_id), "user_id": current_user["id"]}
        )
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/wardrobe-outfits")
async def generate_wardrobe_outfits(
    payload: dict = Body(default={}),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        gender = current_user.get("gender", "Male")
        
        # Retrieve wardrobe items for user from clothing_metadata
        raw_items = await db["clothing_metadata"].find({"user_id": user_id}).to_list(100)
        items = []
        for i in raw_items:
            img_src = i.get("image_url") or i.get("src") or i.get("url") or i.get("image") or ""
            items.append({
                "id": str(i["_id"]),
                "name": i.get("name") or "Clothing Item",
                "category": i.get("category") or "Tops",
                "src": img_src,
                "image_url": img_src,
                "metadata": i.get("metadata", {})
            })
            
        if not items and "items" in payload:
            for i in payload["items"]:
                img_src = i.get("src") or i.get("image_url") or i.get("url") or i.get("image") or ""
                items.append({
                    "id": str(i.get("id") or i.get("_id") or Date.now()),
                    "name": i.get("name") or "Clothing Item",
                    "category": i.get("category") or "Tops",
                    "src": img_src,
                    "image_url": img_src,
                    "metadata": i.get("metadata", {})
                })
                
        # If still no items, check user's uploaded looks history from db["looks"]
        if not items:
            raw_looks = await db["looks"].find({"user_id": user_id}).sort("created_at", -1).to_list(20)
            for idx, look in enumerate(raw_looks):
                img_src = look.get("image_url") or look.get("src") or look.get("url") or ""
                if img_src:
                    items.append({
                        "id": str(look.get("_id", f"look-{idx}")),
                        "name": f"Uploaded item ({idx+1})",
                        "category": "Tops" if idx % 2 == 0 else "Bottoms",
                        "src": img_src,
                        "image_url": img_src,
                        "metadata": {}
                    })
            
        tops = [i for i in items if i.get("category") in ["Tops", "Outerwear", "Dresses"]]
        bottoms = [i for i in items if i.get("category") == "Bottoms"]
        
        # Model 1: Pairings using user's uploaded wardrobe items exclusively
        model_1_pairs = []
        if tops and bottoms:
            for top in tops:
                for bottom in bottoms:
                    model_1_pairs.append({
                        "id": f"m1-{top['id']}-{bottom['id']}",
                        "title": f"{top['name']} + {bottom['name']}",
                        "style_note": f"Combines your {top['name']} with your {bottom['name']} for a complete custom look.",
                        "top": top,
                        "bottom": bottom
                    })
        elif items:
            # If user has only tops or only bottoms, create single item focus suggestions
            for item in items:
                model_1_pairs.append({
                    "id": f"m1-{item['id']}",
                    "title": item["name"],
                    "style_note": f"Your saved {item['name']} - pair with matching accessories or pieces from your closet.",
                    "item": item
                })
                
        # Model 2: Pairings using user items matched with Fitzy catalog items
        model_2_pairs = []
        for item in items:
            cat = (item.get("category") or "").lower()
            is_bottom = "bottom" in cat or "pant" in cat or "jean" in cat or "trouser" in cat
            
            target_catalog_category = "Shirts" if is_bottom else "Trousers"
            query = item.get("name", "") or ("T-Shirt" if is_bottom else "Chinos")
            
            matched_products = recommendation_service.search_products(
                query=query,
                category=target_catalog_category,
                gender=gender,
                limit=2
            )
            
            for prod in matched_products:
                model_2_pairs.append({
                    "id": f"m2-{item['id']}-{prod['product_id']}",
                    "title": f"Your {item['name']} + {prod['title']}",
                    "style_note": f"Pair your uploaded {item['name']} with this trending {prod['title']} from Fitzy catalog.",
                    "user_item": item,
                    "catalog_item": prod
                })
                
        return {
            "success": True,
            "model_1_pairs": model_1_pairs[:8],
            "model_2_pairs": model_2_pairs[:8]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/catalog")
async def get_catalog(
    gender: str = None,
    category: str = None,
    query: str = None,
    limit: int = 100,
    skip: int = 0
):
    try:
        data = recommendation_service.get_catalog(
            gender=gender,
            category=category,
            query=query,
            limit=limit,
            skip=skip
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))