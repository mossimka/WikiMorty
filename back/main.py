import httpx
from fastapi import FastAPI, HTTPException, Query
from typing import Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

from routes import characters, locations, episodes

app = FastAPI()

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://nfactorial2-24pj6b3nn-mossimkas-projects.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(episodes.router, prefix="/api")

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Welcome to the Rick and Morty API Proxy!",
        "documentation": "/docs"
    }