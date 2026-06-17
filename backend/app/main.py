from fastapi import FastAPI,HTTPException
from core.database import client

app = FastAPI(
    title="Fitzy backend APIs"
)

@app.get("/health")
async def health():
    db_status = "down"
    try:
        await client.admin.command("ping")
        db_status = "up"
    except Exception:
        db_status = "down"

    return {
        "status":"ok",
        "service" : "backend",
        "database" : db_status
    }