import requests
from flask import session

def get_spotify_user_info(access_token): 
    url = 'https://api.spotify.com/v1/me'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def save_user_info_to_session(user_info):
    
    session['user_id'] = user_info['id']
    session['display_name'] = user_info.get('display_name', 'Unknown User')
    session['profile_image'] = user_info.get('images', [{}])[0].get('url', '')