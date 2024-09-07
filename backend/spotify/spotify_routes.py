from flask import Blueprint, request, redirect, session, jsonify

from . import spotify_authentication
from .util.user_info import get_spotify_user_info , save_user_info_to_session
from .util.tracks import slice_chunk_list , fetch_track_details , fetch_track_search_results , extract_track_ids_from_search , split_track_ids , get_seed_tracks , fetch_similar_tracks
from .util.playlists import get_related_playlists , extract_playlist_data , get_playlist_tracks, extract_track_ids , create_playlist , add_items_to_playlist

import requests


spotify_bp = Blueprint('spotify', __name__, template_folder="../../frontend/public/templates")

@spotify_bp.route('/login')
def login():
    session.clear()
    auth_url = spotify_authentication.retrieve_auth_url()
    return redirect(auth_url)

@spotify_bp.route('/callback')
def callback():
    """
    Handles the Spotify OAuth 2.0 callback, where the authorization code is exchanged for an access token. The access token is then used to retrieve the user's
    profile information to the session.
    
    Returns:
        A redirect to the dashboard upon successful authentication, or to the homepage if any error occurs.
    
    
    """
    code = request.args.get('code')
    if not code: 
        return redirect('/')
    
    token_info = spotify_authentication.exchange_code_for_token_info(code)
    
    if 'error' in token_info or 'access_token' not in token_info:    
        return redirect('/')
    
    #add 'access_token' from token_info to the session
    session['access_token'] = token_info['access_token']
    
    try:
        user_info = get_spotify_user_info(token_info['access_token'])
    except requests.exceptions.HTTPError as e:
        
        return redirect('/')
    
    #save current user info to the session
    save_user_info_to_session(user_info)
    
    # Redirect to the dashboard after successfully logging in
    return redirect('/dashboard')
    

    
    
 

@spotify_bp.route('/search_related_playlists', methods=['GET'])
def search_related_playlists():
    """
    Searches for related Spotify playlists based on the provided movie title. The playlists' ID, name, and tracks are extracted and the results are returned as a JSON
    
    Query Parameters:
        - 'movie_title' (str): The title of the movie for which related Spotify playlists are being searched
    
    Returns:
        A JSON response containing playlist data or an appropriate error message:
        - 200: Successfully found and returned related playlist data
        - 400: 'movie_title' query parameter is missing
        - 404: No playlists found related to the movie title
        - 500: An error occured while processing the request
    
    """
    
    movie_title = request.args.get('movie_title')
    
    if not movie_title:
        return jsonify({"error": "movie_title parameter is required"}), 400
    
    try:
        playlists = get_related_playlists(movie_title, session['access_token'])
        
        if not playlists.get('playlists', {}).get('items'):
            return jsonify({"message": "No playlists found for the movie title"}), 404
        
        #extract the playlist ID, name, and tracks
        playlist_data = extract_playlist_data(playlists)
        
        return jsonify(playlist_data), 200

    except ValueError as e:
       
        return jsonify({"error": str(e)}), 500
    except Exception as err:
       
        return jsonify({"error": f"An unexpected error occurred: {err}"}), 500

    
@spotify_bp.route('/get_tracks', methods=['GET'])
def get_tracks():
    """
    Retrieves detailed information about multiple Spotify tracks and returns the information as a JSON response
    
    Query Parameters:
        - 'track_ids' (str): A comma-separated string of Spotify track IDs
        
    Returns:
        A JSON response containing detailed track information or an appropriate error message
        - 200: Successfull fetched and returned track details
        - 400: 'track_ids' query parameter is missing
        - 500: An error occured while fetching track details from Spotify
    
    """
    track_ids = request.args.get('track_ids')
    
    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400

    track_ids_list = track_ids.split(',')
    all_track_details = []
    
    #slice the track_ids_list into a chunk of five
    for chunk in slice_chunk_list(track_ids_list, 5):
        
        #for each chunk, fetch their track details
        result = fetch_track_details(chunk, session["access_token"])
        if "error" in result:
            return jsonify(result), 500
        all_track_details.extend(result.get('tracks', []))

    return jsonify({"tracks": all_track_details}), 200








@spotify_bp.route('/get_playlist_songIDs', methods=['GET'])
def get_playlist_songs():
    """
    Retrieves the song IDs of all tracks in a specified Spotify playlist and returns the track IDs as a JSON 
    
    Query Parameters:
        - 'playlist_ID' (str): The Spotify ID of the playlist to retrieve track IDs for
        
    Returns:
        A JSON response containing:
        - 'playlist_id': The ID of the requested playlist
        - 'track_ids': A list of track IDs for all retrieved songs in the playlist
        HTTP Status Codes:
        - 200: Successfully retrieved track IDs
        - 500: An error occurred 
    
    """

    try:
        playlist_id = request.args.get('playlist_ID')
        
        #get playlist tracks using thje playlist ID
        playlist_items = get_playlist_tracks(playlist_id)
        
        #extract track IDs from the playlist 
        track_ids = extract_track_ids(playlist_items)
        
        all_playlists_songIDs = {
            'playlist_id': playlist_id,
            'track_ids': track_ids
        }
        
        return jsonify(all_playlists_songIDs), 200

    except requests.HTTPError as http_err:
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
    except Exception as err:
        return jsonify({"error": f"An error occurred: {err}"}), 500

        
         
        
@spotify_bp.route('/search_request', methods=['GET'])
def search_song():
    """
    Searches for tracks on Spotify API based on a user's search request and returns track IDs
    
    Query Parameters:
        - 'searchRequest' (str): The search input for finding tracks on Spotify
        
    Returns:
        A JSON response containing:
        - 'track_ids': A list of track IDs that match the search request
        HTTP Status Codes:
        - 200: Successfully retrieved track IDs based on the search request
        - 500: An error occurred 
    
    
    """
    
    search_request = request.args.get('searchRequest')
    
    
    try:
        #perform the search and retrieve appropriate tracks
        tracks = fetch_track_search_results(search_request)
        
        #extract just track IDs from the search results (tracks)
        track_ids = extract_track_ids_from_search(tracks)
        
        
        return jsonify({'track_ids': track_ids}), 200
    
    except requests.exceptions.HTTPError as e:
    
        return jsonify({'error': 'Failed to fetch data from Spotify API'}), 500
    except Exception as e:
        
        return jsonify({'error': 'An error occurred'}), 500
    

    
@spotify_bp.route('/add_playlist', methods=['POST'])
def add_playlist():
    """
    Creates a new Spotify playlist and adds the user's selected tracks to it
    
    Request Body (JSON):
        - 'track_ids' (list of str): A list of Spotify track IDs to add to the playlist
        - 'playlist_name' (str): The name of the new playlist to be created
    
    """
    try:
        
        data = request.get_json()

        track_IDs = data.get('track_ids')
        
        playlist_name = data.get('playlist_name')
        
        if not track_IDs:
            raise ValueError('No track IDs provided')
        
        playlist_ID = create_playlist(playlist_name)
        
        add_items_to_playlist(playlist_ID, track_IDs)
        
        return jsonify({'message': 'Playlist items added successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
    
    
    
    
    
    
@spotify_bp.route('/similar_tracks', methods=['GET'])
def get_similar_tracks():
    """
    Retrieves similar track recommendations based on provided track IDs
    
    Query Parameters:
    - 'track_ids' (str): A comma-separated list of track IDs to use as seeds for the recommendations
    
    Returns:
        A JSON response containing:
        - 'tracks': A list of similar tracks recommended based on the seed tracks
        Possible HTTP Status Codes:
        - 200: Successfully retrieved similar tracks.
        - 400: No track IDs were provided in the request.
        - 500: An error occurred 
    
    """
    
    track_ids = request.args.get('track_ids')
    
    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400
    
    #split the track IDs into a list
    track_ids_list = split_track_ids(track_ids)
    
    #get seed tracks for generating recommendations
    seed_tracks = get_seed_tracks(track_ids_list)
    
    try:
        #fetch similar track recommendations from the Spotify API
        recommendations = fetch_similar_tracks(seed_tracks)
    except requests.HTTPError as http_err:
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
    except Exception as err:
        return jsonify({"error": f"An error occurred: {err}"}), 500

    return jsonify({"tracks": recommendations.get('tracks', [])}), 200