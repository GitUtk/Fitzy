import io
import base64
import httpx
from app.core.config import GRADIO_API_URL
from app.services.cloudinary_service import upload_image_to_cloudinary

class TryOnService:
    def __init__(self):
        self.gradio_url = GRADIO_API_URL.rstrip("/")

    async def download_image(self, url: str) -> bytes:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.content
            raise RuntimeError(f"Failed to download image from {url}")

    async def upload_to_gradio(self, file_bytes: bytes, filename: str) -> dict:
        url = f"{self.gradio_url}/upload"
        files = {"files": (filename, file_bytes, "image/png")}
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, files=files)
            if response.status_code == 200:
                data = response.json()
                return {"path": data[0], "meta": {"_type": "gradio.FileData"}}
            raise RuntimeError(f"Gradio upload failed: {response.text}")

    async def generate_tryon(self, person_bytes: bytes, garment_url: str, category: str = "tops") -> str:
        garment_bytes = await self.download_image(garment_url)
        
        try:
            person_file = await self.upload_to_gradio(person_bytes, "person.png")
            garment_file = await self.upload_to_gradio(garment_bytes, "garment.png")
        except Exception:
            person_b64 = base64.b64encode(person_bytes).decode("utf-8")
            garment_b64 = base64.b64encode(garment_bytes).decode("utf-8")
            person_file = {
                "path": "",
                "url": "",
                "orig_name": "person.png",
                "size": len(person_bytes),
                "mime_type": "image/png",
                "data": f"data:image/png;base64,{person_b64}",
                "meta": {"_type": "gradio.FileData"}
            }
            garment_file = {
                "path": "",
                "url": "",
                "orig_name": "garment.png",
                "size": len(garment_bytes),
                "mime_type": "image/png",
                "data": f"data:image/png;base64,{garment_b64}",
                "meta": {"_type": "gradio.FileData"}
            }

        url = f"{self.gradio_url}/api/predict"
        payload = {
            "data": [
                person_file,
                garment_file,
                category,
                "model",
                1,
                20,
                1.5,
                42,
                True
            ]
        }
        
        async with httpx.AsyncClient(timeout=150.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                url_run = f"{self.gradio_url}/run/predict"
                response = await client.post(url_run, json=payload)
                if response.status_code != 200:
                    raise RuntimeError(f"Gradio prediction failed: {response.text}")
            
            res_json = response.json()
            try:
                gallery = res_json["data"][0]
                if isinstance(gallery, list) and len(gallery) > 0:
                    first_img = gallery[0]
                else:
                    first_img = gallery
                
                if isinstance(first_img, dict):
                    if "image" in first_img and isinstance(first_img["image"], dict) and "path" in first_img["image"]:
                        output_path = first_img["image"]["path"]
                    elif "name" in first_img:
                        output_path = first_img["name"]
                    else:
                        output_path = first_img.get("path")
                else:
                    output_path = first_img
                
                if isinstance(output_path, str) and output_path.startswith("data:image/"):
                    header, base64_str = output_path.split(",", 1)
                    output_bytes = base64.b64decode(base64_str)
                else:
                    if output_path.startswith("http"):
                        output_url = output_path
                    else:
                        output_url = f"{self.gradio_url}/file={output_path}"
                    output_bytes = await self.download_image(output_url)
                
                cloudinary_res = await upload_image_to_cloudinary(output_bytes)
                return cloudinary_res["secure_url"]
            except Exception as e:
                raise RuntimeError(f"Failed to parse Gradio response: {str(e)}. Response: {res_json}")

tryon_service = TryOnService()
