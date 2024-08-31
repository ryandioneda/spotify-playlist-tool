import requests
import os

OMDB_BASE_URL = 'http://www.omdbapi.com/'
OMDB_API_KEY = os.getenv('OMDB_API_KEY')


def get_movie_details(title):
    
    params = {
        'apikey' : OMDB_API_KEY,
        't' : title
    }
    
    
    response = requests.get(OMDB_BASE_URL, params=params)
    print(response)
    
    # response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if "Error" in data: 
            print(f"Error: {data['Error']}") 
            return None 
        return data 
    
    else:
        return None