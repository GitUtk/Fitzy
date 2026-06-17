from fastapi import APIRouter
from app.core.database import client

router = APIRouter()


@router.get("/health")
async def health():
    status = "down"
    try:
        await client.admin.command("ping")
        status = "up"
    except:
        pass

    return {"status": "ok", "database": status}