import requests
import os

OMDB_BASE_URL = 'http://www.omdbapi.com/'
OMDB_API_KEY = os.getenv('OMDB_API_KEY')


def get_movie_details(title):
    """
    Fetches details of a movie from the OMDB API based on the provided title
    
    Args:
        title (str): The title of the movie to fetch details for
    
    Returns:
        dict or none: A dictionary containing movie details if the request is successful. None
        if the movie was not found or an error occurs, it returns none.
    """
    
    params = {
        'apikey' : OMDB_API_KEY,
        't' : title
    }
    
    response = requests.get(OMDB_BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if "Error" in data: 
            print(f"Error: {data['Error']}") 
            return None 
        return data 
    
    else:
        return None