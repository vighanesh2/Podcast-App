from flask import Blueprint, request, jsonify
from models.analytics import Analytics
from datetime import datetime, timedelta
from bson import ObjectId

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['POST'])
def create_analytics_record():
    """Create a new analytics record"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        analytics_model = Analytics(request.db)
        analytics_id = analytics_model.create_analytics_record(data)
        
        return jsonify({
            'message': 'Analytics record created successfully',
            'analytics_id': analytics_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/<analytics_id>', methods=['GET'])
def get_analytics_record(analytics_id):
    """Get a specific analytics record by ID"""
    try:
        analytics_model = Analytics(request.db)
        record = analytics_model.get_analytics_by_id(analytics_id)
        
        if not record:
            return jsonify({'error': 'Analytics record not found'}), 404
        
        record['_id'] = str(record['_id'])
        if 'userId' in record:
            record['userId'] = str(record['userId'])
        if 'episodeId' in record:
            record['episodeId'] = str(record['episodeId'])
        
        return jsonify({'analytics': record}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/user/<user_id>', methods=['GET'])
def get_analytics_by_user(user_id):
    """Get analytics for a user with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        analytics_model = Analytics(request.db)
        records = analytics_model.get_analytics_by_user(user_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record['_id'] = str(record['_id'])
            if 'userId' in record:
                record['userId'] = str(record['userId'])
            if 'episodeId' in record:
                record['episodeId'] = str(record['episodeId'])
        
        return jsonify({
            'analytics': records,
            'count': len(records),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/type/<analytics_type>', methods=['GET'])
def get_analytics_by_type(analytics_type):
    """Get analytics by type"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        analytics_model = Analytics(request.db)
        records = analytics_model.get_analytics_by_type(analytics_type, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record['_id'] = str(record['_id'])
            if 'userId' in record:
                record['userId'] = str(record['userId'])
            if 'episodeId' in record:
                record['episodeId'] = str(record['episodeId'])
        
        return jsonify({
            'analytics': records,
            'count': len(records),
            'type': analytics_type,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/date-range', methods=['GET'])
def get_analytics_by_date_range():
    """Get analytics within date range"""
    try:
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if not start_date_str or not end_date_str:
            return jsonify({'error': 'start_date and end_date are required'}), 400
        
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        skip = (page - 1) * limit
        
        analytics_model = Analytics(request.db)
        records = analytics_model.get_analytics_by_date_range(start_date, end_date, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record['_id'] = str(record['_id'])
            if 'userId' in record:
                record['userId'] = str(record['userId'])
            if 'episodeId' in record:
                record['episodeId'] = str(record['episodeId'])
        
        return jsonify({
            'analytics': records,
            'count': len(records),
            'start_date': start_date_str,
            'end_date': end_date_str,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/user/<user_id>/summary', methods=['GET'])
def get_user_analytics_summary(user_id):
    """Get user analytics summary"""
    try:
        days = int(request.args.get('days', 30))
        
        analytics_model = Analytics(request.db)
        summary = analytics_model.get_user_analytics_summary(user_id, days)
        
        return jsonify({
            'summary': summary,
            'user_id': user_id,
            'days': days
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/episode/<episode_id>', methods=['GET'])
def get_episode_analytics(episode_id):
    """Get analytics for a specific episode"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        skip = (page - 1) * limit
        
        analytics_model = Analytics(request.db)
        records = analytics_model.get_episode_analytics(episode_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record['_id'] = str(record['_id'])
            if 'userId' in record:
                record['userId'] = str(record['userId'])
            if 'episodeId' in record:
                record['episodeId'] = str(record['episodeId'])
        
        return jsonify({
            'analytics': records,
            'count': len(records),
            'episode_id': episode_id,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/track', methods=['POST'])
def track_interaction():
    """Track user interaction"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_id = data['userId']
        interaction_type = data['type']
        episode_id = data.get('episodeId')
        metadata = data.get('metadata')
        
        analytics_model = Analytics(request.db)
        analytics_id = analytics_model.track_interaction(
            user_id, interaction_type, episode_id, metadata
        )
        
        return jsonify({
            'message': 'Interaction tracked successfully',
            'analytics_id': analytics_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/popular-episodes', methods=['GET'])
def get_popular_episodes():
    """Get most popular episodes based on analytics"""
    try:
        limit = int(request.args.get('limit', 10))
        days = int(request.args.get('days', 30))
        
        analytics_model = Analytics(request.db)
        episodes = analytics_model.get_popular_episodes(limit, days)
        
        # Convert ObjectId to string for JSON serialization
        for episode in episodes:
            if 'episodeId' in episode:
                episode['episodeId'] = str(episode['episodeId'])
        
        return jsonify({
            'episodes': episodes,
            'count': len(episodes),
            'days': days
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/cleanup', methods=['DELETE'])
def cleanup_old_analytics():
    """Delete old analytics records"""
    try:
        days = int(request.args.get('days', 90))
        
        analytics_model = Analytics(request.db)
        result = analytics_model.delete_old_analytics(days)
        
        return jsonify({
            'message': f'Old analytics records deleted successfully',
            'deleted_count': result.deleted_count,
            'days': days
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
