from flask import Blueprint, request, jsonify
from .util.movie_info import get_movie_details
import os

omdb_bp = Blueprint('omdb', __name__, template_folder="../../frontend/public/templates")

@omdb_bp.route('/movie_details', methods=['GET']) #when the route is fetched it will get movie details
def movie_details():
    
    title = request.args.get('title')
    if not title:
        return jsonify({'error': 'Title parameter is required'}), 400
    
    movie_info = get_movie_details(title)

    if movie_info:
        return jsonify(movie_info)
    else:
        return jsonify({'error': 'Movie not found or an error occurred'}), 404