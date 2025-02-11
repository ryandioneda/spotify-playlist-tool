from fastapi import APIRouter, Query, Depends

router = APIRouter()

from app.crud.crud_tracks import get_several_tracks

from app.utils.spotify_authentication import get_current_user

@router.get("/api/v2/tracks")    
async def get_tracks(ids: str = Query(...), access_token: str = Depends(get_current_user)):
    return await get_several_tracks(ids, access_token)

# @router.post("/api/v2/track/playback")
# async def get_playback(uri: str, access_token: str = Depends(get_current_user)):
#     return await 