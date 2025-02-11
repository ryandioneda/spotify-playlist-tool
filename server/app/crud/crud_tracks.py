from fastapi import HTTPException, Query
import httpx

async def get_several_tracks(ids: str = Query(...), access_token: str = Query(...)):
    """
    Calls Spotify's 'Get Several Tracks' endpoint 
    """


    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    params = {
        "ids": ids 
    }

    # if len(id) > 50:
    #     raise HTTPException(status_code=400, detail="Spotify allows a maximum of 50 tracks")

    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.spotify.com/v1/tracks", headers=headers, params=params)

    if response.status_code != 200:
        raise HTTPException(response.status_code, "Failed to get tracks")
    
    return response.json()