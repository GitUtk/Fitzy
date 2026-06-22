from fastapi import APIRouter
from app.api.v1.routes import auth, users, health, upload

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(health.router)
router.include_router(upload.router, prefix="/upload", tags=["upload"])