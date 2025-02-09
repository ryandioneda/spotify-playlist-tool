from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from decouple import config

from app.utils.spotify_authentication import generate_random_string

import httpx
import urllib.parse
import base64

router = APIRouter()

CLIENT_URL = config('CLIENT_URL')
CLIENT_ID = config('CLIENT_ID')
REDIRECT_URI = config('REDIRECT_URI')
CLIENT_SECRET = config('CLIENT_SECRET')
SPOTIFY_TOKEN_URL = config('SPOTIFY_TOKEN_URL')

@router.get('/auth/spotify/login')
async def login( ):
    state = generate_random_string(16)
    scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'

    query_params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "scope": scope,
        "redirect_uri": REDIRECT_URI,
        "state": state,
    }

    url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(query_params)
    return RedirectResponse(url)


@router.get("/auth/spotify/callback")
async def spotify_callback(request: Request, response: Response):
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    
    if state is None:
        params = urllib.parse.urlencode({"error": "state_mismatch"})
        return RedirectResponse(url=f"/#?{params}")
    
    client_creds = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_client_creds = base64.b64encode(client_creds.encode("utf-8")).decode("utf-8")
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {b64_client_creds}"
    }
    
    data = {
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(SPOTIFY_TOKEN_URL, data=data, headers=headers)

    if token_response.status_code != 200:
        raise HTTPException(status_code=token_response.status_code, detail="Failed to get token")
    
    token_info = token_response.json()
    access_token = token_info.get("access_token")
    refresh_token = token_info.get("refresh_token")

    response = RedirectResponse(url=f"{CLIENT_URL}/dashboard")

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite='Lax'
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite='Lax'
    )

    return response    

