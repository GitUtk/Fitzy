import io
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
        person_file = await self.upload_to_gradio(person_bytes, "person.png")
        garment_file = await self.upload_to_gradio(garment_bytes, "garment.png")
        
        url = f"{self.gradio_url}/api/predict"
        payload = {
            "data": [
                person_file,
                garment_file,
                category,
                20
            ]
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                url_run = f"{self.gradio_url}/run/predict"
                response = await client.post(url_run, json=payload)
                if response.status_code != 200:
                    raise RuntimeError(f"Gradio prediction failed: {response.text}")
            
            res_json = response.json()
            try:
                output_data = res_json["data"][0]
                if isinstance(output_data, dict) and "path" in output_data:
                    output_path = output_data["path"]
                else:
                    output_path = output_data
                
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
