
    # async with httpx.AsyncClient() as client:
    #     response = await client.get("https://api.spotify.com/v1/me", headers={"Authorization": f"Bearer {access_token}"})

    # if response.status_code != 200:
    #     raise HTTPException(response.status_code, "Failed to fetch user profile")

    # return response.json()
from fastapi import HTTPException

import httpx

async def get_profile_information(access_token: str):
    """
    Gets the current user's profile information
    """
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.spotify.com/v1/me", headers=headers)

    if response.status_code != 200:
        raise HTTPException(response.status_code, "Failed to fetch user profile")
    
    data = response.json()

    display_name = data.get("display_name", "Unknown User")
    images = data.get("images", [])

    if images:
        profile_image_64 = images[1]["url"]
    else:
        None

    return {
        "display_name": display_name,
        "profile_image": profile_image_64
    }

