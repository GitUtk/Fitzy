from fastapi import FastAPI
from app.api.v1.router import router as v1_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Fitzy Backend APIs"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #####
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")
