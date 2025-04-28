from fastapi import APIRouter, Query, Path, HTTPException
from services.rick_and_morty import fetch_from_external_api

router = APIRouter(
    prefix="/episodes",
    tags=["Episodes"]
)

@router.get("/")
async def get_episodes_async(page: int = Query(1, ge=1)):
    return await fetch_from_external_api("episode", params={"page": page})

@router.get("/{episode_id}")
async def get_episode_by_id(episode_id: int):
    return await fetch_from_external_api(f"episode/{episode_id}")