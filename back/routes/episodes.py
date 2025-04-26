from fastapi import APIRouter, Query, Path, HTTPException
from services.rick_and_morty import fetch_from_external_api

router = APIRouter(
    prefix="/episodes",
    tags=["Episodes"]
)

@router.get("/")
async def get_episodes_async(page: int = Query(1, ge=1)):
    return await fetch_from_external_api("episode", params={"page": page})