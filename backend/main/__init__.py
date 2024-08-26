from flask import Flask


from .main_routes import main_bp

def create_app():
    
    app=Flask(__name__,
              static_folder="../../frontend/static",
              template_folder="../../frontend/public/templates")
    
    app.register_blueprint(main_bp)
    
    return app
