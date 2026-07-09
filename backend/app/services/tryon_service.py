import io
import os
import tempfile
import httpx
from gradio_client import Client, handle_file
from fastapi.concurrency import run_in_threadpool
from app.core.database import db
from app.services.cloudinary_service import upload_image_to_cloudinary

class TryOnService:
    def __init__(self):
        pass

    async def download_image(self, url: str) -> bytes:
        # Check if the URL refers to a local file or a static dataset image
        if os.path.exists(url):
            with open(url, "rb") as f:
                return f.read()

        # If it refers to our static images route or is just a filename
        filename = os.path.basename(url)
        current_file_path = os.path.abspath(__file__)
        services_dir = os.path.dirname(current_file_path)
        app_dir = os.path.dirname(services_dir)
        backend_dir = os.path.dirname(app_dir)
        repo_root = os.path.dirname(backend_dir)
        local_path = os.path.join(repo_root, "frontend", "public", "static", "images", filename)
        
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                return f.read()

        # Fallback to HTTP download
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.content
            raise RuntimeError(f"Failed to download image from {url}")

    async def generate_tryon(self, person_bytes: bytes, garment_url: str, category: str = "tops") -> str:
        gradio_doc = await db["gradio_config"].find_one()
        if not gradio_doc or not gradio_doc.get("gradio_url"):
            raise RuntimeError("Gradio live URL is not registered in the database. Please post the URL to /fetchGradio first.")
        active_url = gradio_doc["gradio_url"].rstrip("/")
        garment_bytes = await self.download_image(garment_url)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as person_tmp:
            person_tmp.write(person_bytes)
            person_tmp_path = person_tmp.name

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as garment_tmp:
            garment_tmp.write(garment_bytes)
            garment_tmp_path = garment_tmp.name

        # Map category/wear_type to Gradio categories: 'tops' or 'bottoms'
        category_lower = category.lower()
        if "top" in category_lower or "upper" in category_lower or "shirt" in category_lower or "polo" in category_lower:
            gradio_category = "tops"
        elif "bottom" in category_lower or "pants" in category_lower or "jeans" in category_lower or "trouser" in category_lower or "shorts" in category_lower or "joggers" in category_lower or "cargo" in category_lower:
            gradio_category = "bottoms"
        else:
            gradio_category = "tops"  # Default fallback

        try:
            client = Client(active_url)
            result = await run_in_threadpool(
                client.predict,
                handle_file(person_tmp_path),
                handle_file(garment_tmp_path),
                gradio_category,
                "model",
                1,
                20,
                1.5,
                42,
                True,
                api_name="/predict"
            )

            if isinstance(result, list) and len(result) > 0:
                first_item = result[0]
                if isinstance(first_item, dict):
                    output_path = first_item.get("image") or first_item.get("path")
                else:
                    output_path = first_item
            else:
                output_path = result

            with open(output_path, "rb") as f:
                output_bytes = f.read()

            cloudinary_res = await upload_image_to_cloudinary(output_bytes)
            return cloudinary_res["secure_url"]

        except Exception as e:
            raise RuntimeError(f"Gradio try-on execution failed: {str(e)}")

        finally:
            if os.path.exists(person_tmp_path):
                os.remove(person_tmp_path)
            if os.path.exists(garment_tmp_path):
                os.remove(garment_tmp_path)

tryon_service = TryOnService()
