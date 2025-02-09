from fastapi import APIRouter, HTTPException, Depends

from app.utils.spotify_authentication import get_current_user

import httpx

from app.crud.crud_profile import get_profile_information

router = APIRouter()


@router.get("/user/profile")
async def get_user_profile(access_token: str = Depends(get_current_user)):

    profile_json_results = await get_profile_information(access_token)
    return profile_json_results