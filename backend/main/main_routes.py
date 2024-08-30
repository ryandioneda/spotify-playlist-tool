from flask import Blueprint, render_template, session, redirect, url_for

main_bp = Blueprint("main_bp", __name__, template_folder="../../frontend/public/templates")

@main_bp.route('/')
def index():
    return render_template('index.html')



@main_bp.route('/dashboard')
def dashboard():
    
    if 'access_token' in session:
        access_token = session['access_token']
        display_name = session.get('display_name', 'User')
        profile_image = session.get('profile_image', '/static/default-profile.png')
        return render_template('dashboard.html', access_token=access_token, display_name=display_name, profile_image=profile_image)
        
    else:
        return redirect(url_for('index'))