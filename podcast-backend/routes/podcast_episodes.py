from flask import Blueprint, request, jsonify
from models.podcast_episode import PodcastEpisode
from datetime import datetime
from bson import ObjectId

podcast_episodes_bp = Blueprint('podcast_episodes', __name__)

@podcast_episodes_bp.route('/', methods=['POST'])
def create_episode():
    """Create a new podcast episode"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'title', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        episode_model = PodcastEpisode(request.db)
        episode_id = episode_model.create_episode(data)
        
        return jsonify({
            'message': 'Episode created successfully',
            'episode_id': episode_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/user/<user_id>', methods=['GET'])
def get_episodes_by_user(user_id):
    """Get episodes for a user with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        episode_model = PodcastEpisode(request.db)
        episodes = episode_model.get_episodes_by_user(user_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for episode in episodes:
            episode['_id'] = str(episode['_id'])
            if 'userId' in episode:
                episode['userId'] = str(episode['userId'])
        
        return jsonify({
            'episodes': episodes,
            'count': len(episodes),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/<episode_id>', methods=['GET'])
def get_episode(episode_id):
    """Get a specific episode by ID"""
    try:
        episode_model = PodcastEpisode(request.db)
        episode = episode_model.get_episode_by_id(episode_id)
        
        if not episode:
            return jsonify({'error': 'Episode not found'}), 404
        
        episode['_id'] = str(episode['_id'])
        if 'userId' in episode:
            episode['userId'] = str(episode['userId'])
        
        return jsonify({'episode': episode}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/status/<status>', methods=['GET'])
def get_episodes_by_status(status):
    """Get episodes by status"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        episode_model = PodcastEpisode(request.db)
        episodes = episode_model.get_episodes_by_status(status, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for episode in episodes:
            episode['_id'] = str(episode['_id'])
            if 'userId' in episode:
                episode['userId'] = str(episode['userId'])
        
        return jsonify({
            'episodes': episodes,
            'count': len(episodes),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/<episode_id>', methods=['PUT'])
def update_episode(episode_id):
    """Update an episode"""
    try:
        data = request.get_json()
        
        episode_model = PodcastEpisode(request.db)
        result = episode_model.update_episode(episode_id, data)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Episode not found'}), 404
        
        return jsonify({
            'message': 'Episode updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/<episode_id>/analytics', methods=['PUT'])
def update_episode_analytics(episode_id):
    """Update episode analytics"""
    try:
        data = request.get_json()
        analytics_data = data.get('analytics')
        
        if not analytics_data:
            return jsonify({'error': 'Analytics data is required'}), 400
        
        episode_model = PodcastEpisode(request.db)
        result = episode_model.update_analytics(episode_id, analytics_data)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Episode not found'}), 404
        
        return jsonify({
            'message': 'Episode analytics updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/<episode_id>/analytics/increment', methods=['POST'])
def increment_analytics(episode_id):
    """Increment analytics field"""
    try:
        data = request.get_json()
        field = data.get('field')
        increment = data.get('increment', 1)
        
        if not field:
            return jsonify({'error': 'Field is required'}), 400
        
        episode_model = PodcastEpisode(request.db)
        result = episode_model.increment_analytics(episode_id, field, increment)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Episode not found'}), 404
        
        return jsonify({
            'message': f'Analytics field {field} incremented successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@podcast_episodes_bp.route('/<episode_id>', methods=['DELETE'])
def delete_episode(episode_id):
    """Delete an episode"""
    try:
        episode_model = PodcastEpisode(request.db)
        result = episode_model.delete_episode(episode_id)
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Episode not found'}), 404
        
        return jsonify({
            'message': 'Episode deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
