from flask import Blueprint, request, jsonify
from models.content_template import ContentTemplate
from datetime import datetime
from bson import ObjectId

content_templates_bp = Blueprint('content_templates', __name__)

@content_templates_bp.route('/', methods=['POST'])
def create_template():
    """Create a new content template"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'title', 'content', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        template_model = ContentTemplate(request.db)
        template_id = template_model.create_template(data)
        
        return jsonify({
            'message': 'Content template created successfully',
            'template_id': template_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/<template_id>', methods=['GET'])
def get_template(template_id):
    """Get a specific template by ID"""
    try:
        template_model = ContentTemplate(request.db)
        template = template_model.get_template_by_id(template_id)
        
        if not template:
            return jsonify({'error': 'Template not found'}), 404
        
        template['_id'] = str(template['_id'])
        if 'userId' in template:
            template['userId'] = str(template['userId'])
        
        return jsonify({'template': template}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/user/<user_id>', methods=['GET'])
def get_templates_by_user(user_id):
    """Get templates for a user with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        template_model = ContentTemplate(request.db)
        templates = template_model.get_templates_by_user(user_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            template['_id'] = str(template['_id'])
            if 'userId' in template:
                template['userId'] = str(template['userId'])
        
        return jsonify({
            'templates': templates,
            'count': len(templates),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/category/<category>', methods=['GET'])
def get_templates_by_category(category):
    """Get templates by category"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        template_model = ContentTemplate(request.db)
        templates = template_model.get_templates_by_category(category, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            template['_id'] = str(template['_id'])
            if 'userId' in template:
                template['userId'] = str(template['userId'])
        
        return jsonify({
            'templates': templates,
            'count': len(templates),
            'category': category,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/active', methods=['GET'])
def get_active_templates():
    """Get active templates"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        template_model = ContentTemplate(request.db)
        templates = template_model.get_active_templates(limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            template['_id'] = str(template['_id'])
            if 'userId' in template:
                template['userId'] = str(template['userId'])
        
        return jsonify({
            'templates': templates,
            'count': len(templates),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/search', methods=['GET'])
def search_templates():
    """Search templates by title, description, or content"""
    try:
        query = request.args.get('q')
        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        template_model = ContentTemplate(request.db)
        templates = template_model.search_templates(query, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            template['_id'] = str(template['_id'])
            if 'userId' in template:
                template['userId'] = str(template['userId'])
        
        return jsonify({
            'templates': templates,
            'count': len(templates),
            'query': query,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/popular', methods=['GET'])
def get_popular_templates():
    """Get most popular templates by usage count"""
    try:
        limit = int(request.args.get('limit', 10))
        
        template_model = ContentTemplate(request.db)
        templates = template_model.get_popular_templates(limit)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            template['_id'] = str(template['_id'])
            if 'userId' in template:
                template['userId'] = str(template['userId'])
        
        return jsonify({
            'templates': templates,
            'count': len(templates)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/<template_id>', methods=['PUT'])
def update_template(template_id):
    """Update a template"""
    try:
        data = request.get_json()
        
        template_model = ContentTemplate(request.db)
        result = template_model.update_template(template_id, data)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Template not found'}), 404
        
        return jsonify({
            'message': 'Template updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/<template_id>/use', methods=['POST'])
def use_template(template_id):
    """Increment template usage count"""
    try:
        template_model = ContentTemplate(request.db)
        result = template_model.increment_usage_count(template_id)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Template not found'}), 404
        
        return jsonify({
            'message': 'Template usage count incremented successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/<template_id>/toggle', methods=['PUT'])
def toggle_template_status(template_id):
    """Toggle template active status"""
    try:
        template_model = ContentTemplate(request.db)
        result = template_model.toggle_active_status(template_id)
        
        if not result:
            return jsonify({'error': 'Template not found'}), 404
        
        return jsonify({
            'message': 'Template status toggled successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_templates_bp.route('/<template_id>', methods=['DELETE'])
def delete_template(template_id):
    """Delete a template"""
    try:
        template_model = ContentTemplate(request.db)
        result = template_model.delete_template(template_id)
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Template not found'}), 404
        
        return jsonify({
            'message': 'Template deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
