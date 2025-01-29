from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from decouple import config

from app.utils.spotify_authentication import *

router = APIRouter()

CLIENT_URL = config('CLIENT_URL')

@router.get("/auth/authorize")
async def authorize():
    auth_url = get_auth_url()
    return RedirectResponse(auth_url)

@router.get('/auth/callback')
async def auth_callback(request: Request):

    code = request.query_params.get('code')
    error = request.query_params.get('error')

    if error:
        print("Error - redirecting to /")
        return RedirectResponse(url=f"{CLIENT_URL}/")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code is required")
    
    try:
        token_info = exchange_code_for_token_info(code)
        access_token = token_info.get('access_token')
        refresh_token = token_info.get('refresh_token')

        return RedirectResponse(url=f"{CLIENT_URL}/dashboard")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error exchanging authorization code for token")
