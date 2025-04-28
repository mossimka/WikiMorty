from fastapi import APIRouter, Query, Path, HTTPException
from typing import Optional, Dict, Any
from services.rick_and_morty import fetch_from_external_api

from services import ai_service

router = APIRouter(
    prefix="/characters",
    tags=["Characters"]
)

@router.get("/")
async def get_characters_list(
        page: int = Query(None, ge=1, description="Page number"),
        name: Optional[str] = Query(None, description="Filter by name"),
        status: Optional[str] = Query(None, description="Filter by status (Alive, Dead, unknown)"),
        species: Optional[str] = Query(None, description="Filter by species"),
        type: Optional[str] = Query(None, description="Filter by type"),
        gender: Optional[str] = Query(None, description="Filter by gender")
):
    params = {"page": page}
    if name: params["name"] = name
    if status: params["status"] = status
    if species: params["species"] = species
    if type: params["type"] = type
    if gender: params["gender"] = gender

    return await fetch_from_external_api("character", params=params)

@router.get("/{character_id}")
async def get_character_by_id(character_id: int):
    return await fetch_from_external_api(f"character/{character_id}")

'''@router.get("/{character_id}/description")
async def get_ai_character_description_simple(character_id: int = Path(..., ge=1)):
    character_data = await fetch_from_external_api(f"character/{character_id}")
    character_name = character_data.get("name")

    ai_response_data = await ai_service.generate_character_description(character_name)

    description = ai_response_data.get('description', 'Description was not generated.') if isinstance(ai_response_data, dict) else 'Error in AI response fromat.'


    return {
        "character_id": character_id,
        "name": character_name,
        "description": description
    }'''
