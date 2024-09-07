import urllib.parse
import requests


from flask import session
from datetime import datetime

def get_auth_url(CLIENT_ID, REDIRECT_URI, AUTH_URL):
    """
    Constructs the authorization URL for Spotify's OAuth 2.0 authorization flow
    
    Args:
        - 'CLIENT_ID' (str): The client ID of the Spotify application
        - 'REDIRECT_URI' (str): The URI to which Spotify will redirect after authorization
        - 'AUTH_URL' (str): The base URL for Spotify's authorization endpoint
        
    Returns:
        str: The complete authorization URL
    
    """
    scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'
    
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code', #Indicates that the authorization server should return an authorization code to the redirect URI
        'scope': scope, 
        'redirect_uri': REDIRECT_URI, 
        'show_dialog': True 
    }
    
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return auth_url


def save_session_token_info(token_info):
    session['access_token'] = token_info['access_token']
    session['refresh_token'] = token_info['refresh_token']
    session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']