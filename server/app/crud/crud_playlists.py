from fastapi import Request, HTTPException, Depends

from app.utils.spotify_authentication import get_current_user

import httpx
import urllib.parse

async def search_related_playlists(search: str, access_token: str):
    """
    Calls Spotify's 'Search for Item' endpoint
    """

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    params = {
        "q": urllib.parse.quote(f"{search} soundtrack"),
        "type": "playlist",
        "limit": 10
    }

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.spotify.com/v1/search", headers=headers, params=params)

    if response.status_code != 200:
        raise HTTPException(response.status_code, "Failed to fetch user profile")
    return response.json()

async def get_playlist_items(playlist_id: str, access_token: str):
    """
    Calls Spotify's 'Get Playlist Items' endpoint 
    """

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    params = {
        "playlist_id": playlist_id,
        "limit": 10
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks", headers=headers, params=params)
    
    if response.status_code != 200:
        raise HTTPException(response.status_code, "Failed to get playlist items")
    return response.json()
