import requests
from flask import session

def get_related_playlists(movie_title, access_token):
    """
    Searches for playlists on Spotify related to a given movie title
    
    Args:
        - 'movie_title' (str): The title of the movie for which to find related playlists
        - 'access_token' (str): The access token for authenticating the API request
        
    Returns:
        - dict: A dictionaryu containing playlists related to the movie title
    
    """
    
    search_url = 'https://api.spotify.com/v1/search'
    search_params = {
        'q': f'{movie_title} soundtrack',
        'type': 'playlist',
        'limit': 10,
    }
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    try:
        response = requests.get(search_url, headers=headers, params=search_params)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as http_err:
        raise ValueError(f"HTTP error occurred: {http_err}")
    except Exception as err:
        raise ValueError(f"An error occurred: {err}")
    
    
    
def extract_playlist_data(playlists):
    """
    Extracts relevant data from the playlist response
    
    Args:
        - 'playlists' (dict): A dictionary containing playlist data from Spotify
        
    Returns:
        - list: A list of dictionaries containing the extracted playlist information
    
    """
    playlist_data = []
    for item in playlists.get('playlists', {}).get('items', []):
        playlist_data.append({
            'id': item.get('id'),
            'name': item.get('name'),
            'tracks_href': item.get('tracks', {}).get('href')
        })
    return playlist_data



def get_playlist_tracks(playlist_id):
    """
    Retrieves the tracks from a specificed playlist
    
    Args:
        - 'playlist_id' (str): The ID of the playlist from which to fetch tracks
        
    Returns:
        - dict: A dictionaryu containing the playlist's tracks
    
    """   
    url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'  
    headers = {
        'Authorization': f'Bearer {session["access_token"]}'
    }  
    params = {
        'market': 'ES',
        'limit': 10,
        'offset': 0, 
        'additional_types': None
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise an error for bad HTTP status codes
    return response.json()


def extract_track_ids(playlist_items):
    items = playlist_items.get('items', [])
    track_ids = []

    for item in items:
        track = item.get('track')
        if track:
            track_id = track.get('id')
            if track_id:
                track_ids.append(track_id)
    
    return track_ids






def create_playlist(playlist_name):
    """
    Creates a new playlist for the current user
    
    Args:
        - 'playlist_name' (str): The name of the new playlist to be created
        
    Returns:
        - str: The ID of the newly created playlist
    
    """
    user_id = session['user_id']
    
    url = f'https://api.spotify.com/v1/users/{user_id}/playlists'
    headers = {
        'Authorization': f'Bearer {session["access_token"]}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': playlist_name,
        'description': "MovieFy Playlist",
        'public': True
    }
    response = requests.post(url, headers=headers, json=data)
    
    response.raise_for_status()
    
    playlist_info = response.json()
    playlist_id = playlist_info['id']  # Extract the playlist ID 
    return playlist_id





def add_items_to_playlist(playlist_ID, track_IDs):
    """
    Adds tracks to a specified playlist
    
    Args:
        - 'playlist_ID' (str): The ID of the playlist to which tracks will be added
        - 'track_IDs' (list): A list of track IDs to be added to the playlist
    
    """
    url = f'https://api.spotify.com/v1/playlists/{playlist_ID}/tracks'
    
    headers = {
        'Authorization': f'Bearer {session["access_token"]}',
        'Content-Type': 'application/json'
    }
    uris = [f'spotify:track:{track_id}' for track_id in track_IDs]
    data = {
        'uris': uris
        
    }
    response = requests.post(url, headers=headers, json=data)
    
    response.raise_for_status()