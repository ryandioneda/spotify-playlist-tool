from flask import Blueprint, render_template, session, redirect, url_for

main_bp = Blueprint("main_bp", __name__, template_folder="../../frontend/public/templates")

@main_bp.route('/')
def index():
    return render_template('index.html')