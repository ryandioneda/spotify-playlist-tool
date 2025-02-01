from fastapi import APIRouter, Query, HTTPException, Request

from app.crud.crud_songs import search_related_playlists 

router = APIRouter()

#these should all return json objects

@router.get("/api/v2/songs/{search}")
async def get_songs(search: str, request: Request):
    print("In search route")
    print("Cookies:", request.cookies)
    access_token = request.cookies.get("access_token")
    print(access_token)

    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing")
    
    playlists = search_related_playlists(search, access_token)
    if playlists is None:
        raise HTTPException(status_code=404, detail="No playlists found")

    return {"search": playlists}

@router.get("/api/v2/recommendations")
async def get_recommendations(track_ids: list[str] = Query(...)):
    return {"track_ids": track_ids}