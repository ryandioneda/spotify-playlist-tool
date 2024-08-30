import requests
import os

OMDB_BASE_URL = 'http://www.omdbapi.com/'
OMDB_API_KEY = os.getenv('OMDB_API_KEY')


def get_movie_details(title):
    
    # params = {
    #     'apikey' : OMDB_API_KEY,
    #     't' : title
    # }
    
    url = f"{OMDB_BASE_URL}?apikey={OMDB_API_KEY}&t={title}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None