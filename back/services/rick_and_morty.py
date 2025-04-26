import httpx
from fastapi import HTTPException
from typing import Optional, Dict, Any

BASE_URL = "https://rickandmortyapi.com/api/"

async def fetch_from_external_api(endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = BASE_URL + endpoint
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as exc:
            print(f"An error occurred while requesting {exc.request.url!r}: {exc}")
            raise HTTPException(status_code=503, detail=f"Service Unavailable: Could not connect to {exc.request.url!r}.")
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
            detail = f"External API error: Status {exc.response.status_code}"
            try:
                error_body = exc.response.json()
                detail += f" - {error_body.get('error', exc.response.text)}"
            except:
                detail += f" - {exc.response.text}"

            raise HTTPException(status_code=exc.response.status_code, detail=detail)