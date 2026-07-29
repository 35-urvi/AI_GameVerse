from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.tic_tac_toe import (
    router as tic_tac_toe_router,
)

from app.api.connect_four import (
    router as connect_four_router,
)


app = FastAPI(
    title="AI GameVerse API",
)


# ================================
# CORS Configuration
# ================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# API Routers
# ================================

app.include_router(
    tic_tac_toe_router
)

app.include_router(
    connect_four_router
)


@app.get("/")
def root():
    return {
        "message": "AI GameVerse Backend Running"
    }