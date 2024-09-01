from flask import Blueprint, request, redirect, render_template, session, jsonify, url_for
from datetime import datetime

from . import spotify_authentication
from .util.authentication import save_session_token_info
from .util.user_info import get_spotify_user_info , save_user_info_to_session
from .util.tracks import slice_chunk_list , fetch_track_details , fetch_track_search_results , extract_track_ids_from_search , split_track_ids , get_seed_tracks , fetch_similar_tracks
from .util.playlists import get_related_playlists , extract_playlist_data , get_playlist_tracks, extract_track_ids , create_playlist , add_items_to_playlist

import requests


spotify_bp = Blueprint('spotify', __name__, template_folder="../../frontend/public/templates")

@spotify_bp.route('/login')
def login():
    session.clear()
    auth_url = spotify_authentication.retrieve_auth_url()
    return redirect(auth_url) #redirect to auth url

@spotify_bp.route('/callback')
def callback():
    
    code = request.args.get('code')
    
    if not code:
        
        return redirect('/')
    
    token_info = spotify_authentication.exchange_code_for_token_info(code)
    
    
    if 'error' in token_info or 'access_token' not in token_info:
        
        return redirect('/')
    
    
    
    
    session['access_token'] = token_info['access_token']
    
    try:
        user_info = get_spotify_user_info(token_info['access_token'])
    except requests.exceptions.HTTPError as e:
        
        return redirect('/')
    
    save_user_info_to_session(user_info)
    
    # Redirect to the dashboard after successfully logging in
    
    return redirect('/dashboard')
    

    
    
 

@spotify_bp.route('/search_related_playlists', methods=['GET'])
def search_related_playlists():
    movie_title = request.args.get('movie_title')

    
    if not movie_title:
        return jsonify({"error": "movie_title parameter is required"}), 400
    
    try:

        playlists = get_related_playlists(movie_title, session['access_token'])
        
       
        
        
        if not playlists.get('playlists', {}).get('items'):
            return jsonify({"message": "No playlists found for the movie title"}), 404
        
        playlist_data = extract_playlist_data(playlists)
        return jsonify(playlist_data), 200

    except ValueError as e:
       
        return jsonify({"error": str(e)}), 500
    except Exception as err:
       
        return jsonify({"error": f"An unexpected error occurred: {err}"}), 500

    
    
#Retrieves track details from Spotify API for a list of track IDs and returns JSON object containing track details for all the IDs
@spotify_bp.route('/get_tracks', methods=['GET'])
def get_tracks():
    track_ids = request.args.get('track_ids')
    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400

    track_ids_list = track_ids.split(',')
    all_track_details = []
    
    for chunk in slice_chunk_list(track_ids_list, 5):
        result = fetch_track_details(chunk, session["access_token"])
        if "error" in result:
            return jsonify(result), 500
        all_track_details.extend(result.get('tracks', []))

    return jsonify({"tracks": all_track_details}), 200








@spotify_bp.route('/get_playlist_songIDs', methods=['GET'])
def get_playlist_songs():
    try:
        playlist_id = request.args.get('playlist_ID')
        
        #Playlist items is a json
        playlist_items = get_playlist_tracks(playlist_id)
        
        #Extract track IDs from JSON
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
    
    search_request = request.args.get('searchRequest')
    print("Search request:", search_request)
    
    try:
        tracks = fetch_track_search_results(search_request)
        print("Tracks:", tracks)
        
        track_ids = extract_track_ids_from_search(tracks)
        print("Track IDs:", track_ids)
        
        return jsonify({'track_ids': track_ids}), 200
    
    except requests.exceptions.HTTPError as e:
        print("Error")
        return jsonify({'error': 'Failed to fetch data from Spotify API'}), 500
    except Exception as e:
        
        return jsonify({'error': 'An error occurred'}), 500
    

    
@spotify_bp.route('/add_playlist', methods=['POST'])
def add_playlist():
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
    
    track_ids = request.args.get('track_ids')
    
    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400
    
    track_ids_list = split_track_ids(track_ids)
    seed_tracks = get_seed_tracks(track_ids_list)
    
    try:
        recommendations = fetch_similar_tracks(seed_tracks)
    except requests.HTTPError as http_err:
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
    except Exception as err:
        return jsonify({"error": f"An error occurred: {err}"}), 500

    return jsonify({"tracks": recommendations.get('tracks', [])}), 200