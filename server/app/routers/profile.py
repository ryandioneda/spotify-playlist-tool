from fastapi import APIRouter, HTTPException, Depends

from app.crud.crud_profile import get_current_user

import httpx

router = APIRouter()


@router.get("/user/profile")
async def get_user_profile(access_token: str = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.spotify.com/v1/me", headers={"Authorization": f"Bearer {access_token}"})

    if response.status_code != 200:
        raise HTTPException(response.status_code, "Failed to fetch user profile")

    return response.json()