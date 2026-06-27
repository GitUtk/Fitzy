from fastapi import APIRouter
from app.api.v1.routes import auth, users, health, upload, recommendation

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(health.router)
router.include_router(upload.router, prefix="/upload", tags=["upload"])
router.include_router(recommendation.router, prefix="/recommendations", tags=["recommendations"])