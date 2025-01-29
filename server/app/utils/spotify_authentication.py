import requests
import urllib.parse

from decouple import config
from fastapi import HTTPException
from base64 import b64encode


SPOTIFY_API_URL = 'https://api.spotify.com/v1'
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = 'http://localhost:8000/auth/callback'
ID = config('CLIENT_ID')
SECRET =config('CLIENT_SECRET') 

def get_auth_url():
    scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'

    params = {
        'client_id': ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'show_dialog': True
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return auth_url

def exchange_code_for_token_info(code):
    req_body = {
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'client_id': ID,
        'client_secret': SECRET
    }
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()

    return token_info

def get_refresh_token(refresh_token: str):
    
    auth_header = b64encode(f"{ID}:{SECRET}".encode()).decode()

    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }
    response = requests.post(TOKEN_URL, headers=headers, data=data)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    
    token_data = response.json()
    return {
        "access_token": token_data["access_token"],
        "refresh_token": token_data.get("refresh_token", refresh_token)
    }