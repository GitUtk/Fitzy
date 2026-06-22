import asyncio
import cloudinary
import cloudinary.uploader
from app.core.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_CLOUD_NAME != "your_cloud_name":
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )

async def upload_image_to_cloudinary(file_bytes: bytes) -> dict:
    if not CLOUDINARY_CLOUD_NAME or CLOUDINARY_CLOUD_NAME == "your_cloud_name":
        import uuid
        mock_id = f"mock_{uuid.uuid4().hex}"
        print("WARNING: Cloudinary credentials not configured. Returning a mock fashion image URL.")
        return {
            "secure_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "public_id": mock_id,
            "is_mock": True
        }

    def _upload():
        return cloudinary.uploader.upload(file_bytes, folder="fitzy")
    
    return await asyncio.to_thread(_upload)
