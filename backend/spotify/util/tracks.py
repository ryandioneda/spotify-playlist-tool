import requests
from flask import session

def slice_chunk_list(lst, chunk_size):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]
        
#Fetches track details from Spotify API using list of trackIDs and an access token for authentication
def fetch_track_details(ids_chunk, access_token):
    try:
        url = 'https://api.spotify.com/v1/tracks'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        params = {
            'market': 'ES',
            'ids': ','.join(ids_chunk)
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as http_err:
        return {"error": f"HTTP error occurred: {http_err}"}
    except Exception as err:
        return {"error": f"An error occurred: {err}"}
    
"""Fetches search results for a song title from Spotify API"""    
def fetch_track_search_results(song_title):
    
    search_url = 'https://api.spotify.com/v1/search'
    search_headers = {
        'Authorization': f'Bearer {session["access_token"]}',
    }
    search_params = {
        'q': song_title,
        'type': 'track',
        'limit': 25,
    }
    search_response = requests.get(search_url, headers=search_headers, params=search_params)
    search_response.raise_for_status()  # Raise an error for bad HTTP status codes
    return search_response.json()

"""Extract track IDs from search results"""
def extract_track_ids_from_search(songs):
    return [track['id'] for track in songs.get('tracks', {}).get('items', [])]




"""Splits multiple track IDs into a list of individual track IDs"""
def split_track_ids(track_ids):
    return track_ids.split(',')


def get_seed_tracks(track_ids_list, max_seeds=5):
    """Get the seed tracks from the provided list, limited to max_seeds."""
    return track_ids_list[:max_seeds]


def fetch_similar_tracks(seed_tracks):
    """Fetch similar tracks based on seed tracks from the Spotify API."""
    url = 'https://api.spotify.com/v1/recommendations'
    headers = {
        'Authorization': f'Bearer {session["access_token"]}'
    }
    params = {
        'seed_tracks': ','.join(seed_tracks),
        'limit': 50  # You can adjust the limit as needed
    }
    response = requests.get(url, headers=headers, params=params)
    
    response.raise_for_status()  # Raise an error for bad HTTP status codes
    return response.json()