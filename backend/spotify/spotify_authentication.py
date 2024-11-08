import os
import requests

from .util.authentication import get_auth_url

SPOTIFY_API_URL = 'https://api.spotify.com/v1'
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = 'http://localhost:5000/spotify/callback'

CLIENT_ID = os.getenv('CLIENT_ID')

CLIENT_SECRET = os.getenv('CLIENT_SECRET')


def retrieve_auth_url():
    """
    Generates and returns the Spotify authorization URL using the CLIENT ID, REDIRECT URI, and authorization base URL. This URL allows the 
    user to log in and authorize access to their Spotify account
    
    Returns:
        'auth_url' (str): The constructed Spotify authorization URL
    
    
    """
    auth_url = get_auth_url(CLIENT_ID, REDIRECT_URI, AUTH_URL)
    return auth_url


def exchange_code_for_token_info(code):
    """
    Exchanges an authorization code for an access token
    
    Args:
        - 'code' (str): The authorization code provided by Spotify after successful user authentication
        
    Returns:
        - dict: A dictionary containing the token information, which includes the access token, refresh token, expiration time, 
        and other relevant details. If request fails, it will contain error information
    
    """
    
    #exchange authorization code for access token
    req_body = {
        'code': code, 
        'grant_type': 'authorization_code', 
        'redirect_uri': REDIRECT_URI, 
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()
    
    
    return token_info