from flask import Blueprint, request, jsonify
from .util.movie_info import get_movie_details
import os

omdb_bp = Blueprint('omdb', __name__, template_folder="../../frontend/public/templates")

@omdb_bp.route('/movie_details', methods=['GET'])
def movie_details():
    """
    Retrieves details about a movie based on the title provided in the query parameters
    
    Returns:
        JSON response containing the movie details or an error message with an HTTP status code
        - 200: If the movie is found, returns the movie details
        - 400: If the 'title' parameter is missing, returns an error message
        - 404: If the movie is not found or an error occurs, returns an error message  
    """
    
    title = request.args.get('title')
    if not title:
        return jsonify({'error': 'Title parameter is required'}), 400
    
    movie_info = get_movie_details(title)

    if movie_info:
        return jsonify(movie_info)
    else:
        return jsonify({'error': 'Movie not found or an error occurred'}), 404