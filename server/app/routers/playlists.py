
from fastapi import APIRouter, Depends 

from app.crud.crud_playlists import search_related_playlists, get_playlist_items

from app.utils.spotify_authentication import get_current_user

router = APIRouter()

#these should all return json objects

@router.get("/api/v2/playlists/{search}")
async def get_songs(search: str, access_token: str = Depends(get_current_user)):
    """
    Searches related playlists based on a user defined search and returns JSON response
    """

    search_json_results = await search_related_playlists(search, access_token)
    return search_json_results

@router.get("/api/v2/playlists/{playlist_id}/tracks")
async def get_playlist_tracks(playlist_id: str, access_token: str = Depends(get_current_user)):
    """
    Gets a playlist's tracks and returns a JSON Response containing the Track IDs 
    """
    print("In playlist id route")
    playlist_track_json_results = await get_playlist_items(playlist_id, access_token)
    print(playlist_track_json_results)
    return playlist_track_json_results

    

    # returns a JSON object of track IDs


