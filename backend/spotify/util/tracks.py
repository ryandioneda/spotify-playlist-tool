import requests
from flask import session

def slice_chunk_list(lst, chunk_size):
    """
    Splits a list into chunks of a specified size
    
    Args:
        - 'lst' (list): The list to be divided into chunks
        - 'chunk_size' (int): The size of each chunk
    
    Yields:
        'list': A chunk of the original list with a size of 'chunk_size'
    
    """
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]
        

def fetch_track_details(ids_chunk, access_token):
    """
    Fetches detailed information about tracks from Spotify API using a list of track IDs
    
    Args:
        - 'ids_chunk' (list): A list of track IDs for which to fetch details
        - 'access_token' (str): The access token for authenticating the API request
        
    Returns:
        - dict: A dictionary containing track details or an error message if the request fails
    
    
    """
    
    
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
    
    
def fetch_track_search_results(search_request):
    """
    Searches for tracks on Spotify based on a search query
    
    Args:
        - 'search_request' (str): The search query to find tracks
        
    Returns:
        - dict: A dictionary containing search results from Spotify
    
    """
    
    
    search_url = 'https://api.spotify.com/v1/search'
    search_headers = {
        'Authorization': f'Bearer {session["access_token"]}',
    }
    search_params = {
        'q': search_request,
        'type': 'track',
        'limit': 25,
    }
    search_response = requests.get(search_url, headers=search_headers, params=search_params)
    search_response.raise_for_status()  # Raise an error for bad HTTP status codes
    return search_response.json()


def extract_track_ids_from_search(tracks):
    """
    Extracts track IDs from the search results.

    Args:
        - 'tracks' (dict): A dictionary containing search results from Spotify.

    Returns:
        - 'list': A list of track IDs extracted from the search results.
    """
    return [track['id'] for track in tracks.get('tracks', {}).get('items', [])]





def split_track_ids(track_ids):
    return track_ids.split(',')


def get_seed_tracks(track_ids_list, max_seeds=5):
 
    return track_ids_list[:max_seeds]


def fetch_similar_tracks(seed_tracks):
    """
    Fetches track recommendations based on seed tracks from Spotify API
    
    Args:
        - 'seed_tracks' (list): A list of track IDSs to be used as seed tracks for recommendations
        
    Returns:
        - dict: A dictionary containing similar track recommendations
    
    """

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