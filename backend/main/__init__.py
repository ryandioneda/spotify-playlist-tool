from flask import Flask
from dotenv import load_dotenv
import os

from .main_routes import main_bp
from ..spotify.spotify_routes import spotify_bp
from ..omdb.omdb_routes import omdb_bp


def create_app():
    """
    Creates flask application
    
    """
    
    load_dotenv()
    
    app=Flask(__name__,
              static_folder="../../frontend/static",
              template_folder="../../frontend/public/templates")
    
    app.secret_key = os.getenv('CLIENT_SECRET')
    
    app.register_blueprint(main_bp)
    app.register_blueprint(spotify_bp, url_prefix='/spotify')
    app.register_blueprint(omdb_bp, url_prefix='/omdb')
    
    return app
