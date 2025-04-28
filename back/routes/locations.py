from fastapi import APIRouter, Query, Path, HTTPException
from services.rick_and_morty import fetch_from_external_api

router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)

@router.get("/")
async def get_locations_async(page: int = Query(1, ge=1)):
    return await fetch_from_external_api("location", params={"page": page})

@router.get("/{location_id}")
async def get_location(location_id: int):
    return await fetch_from_external_api(f"location/{location_id}")