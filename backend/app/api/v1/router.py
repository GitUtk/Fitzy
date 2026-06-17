from fastapi import APIRouter
from app.api.v1.routes import auth, users, health

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(health.router)