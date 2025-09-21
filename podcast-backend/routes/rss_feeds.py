from flask import Blueprint, request, jsonify
from models.rss_feed import RSSFeed
from datetime import datetime
from bson import ObjectId

rss_feeds_bp = Blueprint('rss_feeds', __name__)

@rss_feeds_bp.route('/', methods=['POST'])
def create_feed():
    """Create a new RSS feed"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'title', 'feedUrl']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        feed_model = RSSFeed(request.db)
        feed_id = feed_model.create_feed(data)
        
        return jsonify({
            'message': 'RSS feed created successfully',
            'feed_id': feed_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/<feed_id>', methods=['GET'])
def get_feed(feed_id):
    """Get a specific feed by ID"""
    try:
        feed_model = RSSFeed(request.db)
        feed = feed_model.get_feed_by_id(feed_id)
        
        if not feed:
            return jsonify({'error': 'Feed not found'}), 404
        
        feed['_id'] = str(feed['_id'])
        if 'userId' in feed:
            feed['userId'] = str(feed['userId'])
        
        return jsonify({'feed': feed}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/user/<user_id>', methods=['GET'])
def get_feeds_by_user(user_id):
    """Get feeds for a user with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        feed_model = RSSFeed(request.db)
        feeds = feed_model.get_feeds_by_user(user_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for feed in feeds:
            feed['_id'] = str(feed['_id'])
            if 'userId' in feed:
                feed['userId'] = str(feed['userId'])
        
        return jsonify({
            'feeds': feeds,
            'count': len(feeds),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/active', methods=['GET'])
def get_active_feeds():
    """Get active feeds"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        feed_model = RSSFeed(request.db)
        feeds = feed_model.get_active_feeds(limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for feed in feeds:
            feed['_id'] = str(feed['_id'])
            if 'userId' in feed:
                feed['userId'] = str(feed['userId'])
        
        return jsonify({
            'feeds': feeds,
            'count': len(feeds),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/search', methods=['GET'])
def search_feeds():
    """Search feeds by title or description"""
    try:
        query = request.args.get('q')
        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        feed_model = RSSFeed(request.db)
        feeds = feed_model.search_feeds(query, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for feed in feeds:
            feed['_id'] = str(feed['_id'])
            if 'userId' in feed:
                feed['userId'] = str(feed['userId'])
        
        return jsonify({
            'feeds': feeds,
            'count': len(feeds),
            'query': query,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/<feed_id>', methods=['PUT'])
def update_feed(feed_id):
    """Update a feed"""
    try:
        data = request.get_json()
        
        feed_model = RSSFeed(request.db)
        result = feed_model.update_feed(feed_id, data)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Feed not found'}), 404
        
        return jsonify({
            'message': 'Feed updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/<feed_id>/sync', methods=['PUT'])
def update_sync_info(feed_id):
    """Update sync information"""
    try:
        data = request.get_json()
        last_sync = data.get('lastSync')
        sync_count = data.get('syncCount')
        
        if last_sync is None or sync_count is None:
            return jsonify({'error': 'lastSync and syncCount are required'}), 400
        
        feed_model = RSSFeed(request.db)
        result = feed_model.update_sync_info(feed_id, last_sync, sync_count)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Feed not found'}), 404
        
        return jsonify({
            'message': 'Sync information updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/<feed_id>/toggle', methods=['PUT'])
def toggle_feed_status(feed_id):
    """Toggle feed active status"""
    try:
        feed_model = RSSFeed(request.db)
        result = feed_model.toggle_active_status(feed_id)
        
        if not result:
            return jsonify({'error': 'Feed not found'}), 404
        
        return jsonify({
            'message': 'Feed status toggled successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rss_feeds_bp.route('/<feed_id>', methods=['DELETE'])
def delete_feed(feed_id):
    """Delete a feed"""
    try:
        feed_model = RSSFeed(request.db)
        result = feed_model.delete_feed(feed_id)
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Feed not found'}), 404
        
        return jsonify({
            'message': 'Feed deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
