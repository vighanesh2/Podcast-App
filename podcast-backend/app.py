from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from routes.auth import auth_bp
from routes.user_prompts import user_prompts_bp
from routes.podcast_episodes import podcast_episodes_bp
from routes.voice_generation_jobs import voice_jobs_bp
from routes.rss_feeds import rss_feeds_bp
from routes.analytics import analytics_bp
from routes.content_templates import content_templates_bp
from routes.system_config import system_config_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['podcastDB']

# Make db available to routes
@app.before_request
def before_request():
    request.db = db

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/users')
app.register_blueprint(user_prompts_bp, url_prefix='/api/user-prompts')
app.register_blueprint(podcast_episodes_bp, url_prefix='/api/podcast-episodes')
app.register_blueprint(voice_jobs_bp, url_prefix='/api/voice-generation-jobs')
app.register_blueprint(rss_feeds_bp, url_prefix='/api/rss-feeds')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(content_templates_bp, url_prefix='/api/content-templates')
app.register_blueprint(system_config_bp, url_prefix='/api/system-config')

# Test route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'Podcast API is running!',
        'database': 'connected' if db.command('ping') else 'disconnected'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)