from flask import Blueprint, request, jsonify
from models.system_config import SystemConfig
from datetime import datetime
from bson import ObjectId

system_config_bp = Blueprint('system_config', __name__)

@system_config_bp.route('/', methods=['POST'])
def create_config():
    """Create a new system configuration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['key', 'value', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        config_model = SystemConfig(request.db)
        config_id = config_model.create_config(data)
        
        return jsonify({
            'message': 'System configuration created successfully',
            'config_id': config_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/<config_id>', methods=['GET'])
def get_config(config_id):
    """Get a specific configuration by ID"""
    try:
        config_model = SystemConfig(request.db)
        config = config_model.get_config_by_id(config_id)
        
        if not config:
            return jsonify({'error': 'Configuration not found'}), 404
        
        config['_id'] = str(config['_id'])
        
        return jsonify({'config': config}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/key/<key>', methods=['GET'])
def get_config_by_key(key):
    """Get configuration by key"""
    try:
        config_model = SystemConfig(request.db)
        config = config_model.get_config_by_key(key)
        
        if not config:
            return jsonify({'error': 'Configuration not found'}), 404
        
        config['_id'] = str(config['_id'])
        
        return jsonify({'config': config}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/', methods=['GET'])
def get_all_configs():
    """Get all configurations with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        skip = (page - 1) * limit
        
        config_model = SystemConfig(request.db)
        configs = config_model.get_all_configs(limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for config in configs:
            config['_id'] = str(config['_id'])
        
        return jsonify({
            'configs': configs,
            'count': len(configs),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/active', methods=['GET'])
def get_active_configs():
    """Get active configurations"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        skip = (page - 1) * limit
        
        config_model = SystemConfig(request.db)
        configs = config_model.get_active_configs(limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for config in configs:
            config['_id'] = str(config['_id'])
        
        return jsonify({
            'configs': configs,
            'count': len(configs),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/category/<category>', methods=['GET'])
def get_configs_by_category(category):
    """Get configurations by category"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        config_model = SystemConfig(request.db)
        configs = config_model.get_configs_by_category(category, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for config in configs:
            config['_id'] = str(config['_id'])
        
        return jsonify({
            'configs': configs,
            'count': len(configs),
            'category': category,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/<config_id>', methods=['PUT'])
def update_config(config_id):
    """Update a configuration"""
    try:
        data = request.get_json()
        
        config_model = SystemConfig(request.db)
        result = config_model.update_config(config_id, data)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Configuration not found'}), 404
        
        return jsonify({
            'message': 'Configuration updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/key/<key>', methods=['PUT'])
def update_config_by_key(key):
    """Update configuration by key"""
    try:
        data = request.get_json()
        value = data.get('value')
        
        if value is None:
            return jsonify({'error': 'Value is required'}), 400
        
        config_model = SystemConfig(request.db)
        result = config_model.update_config_by_key(key, value)
        
        return jsonify({
            'message': 'Configuration updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/bulk', methods=['PUT'])
def bulk_update_configs():
    """Bulk update multiple configurations"""
    try:
        data = request.get_json()
        configs_data = data.get('configs')
        
        if not configs_data or not isinstance(configs_data, list):
            return jsonify({'error': 'Configs array is required'}), 400
        
        config_model = SystemConfig(request.db)
        result = config_model.bulk_update_configs(configs_data)
        
        return jsonify({
            'message': 'Configurations updated successfully',
            'modified_count': result.modified_count if result else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/<config_id>/toggle', methods=['PUT'])
def toggle_config_status(config_id):
    """Toggle configuration active status"""
    try:
        config_model = SystemConfig(request.db)
        result = config_model.toggle_active_status(config_id)
        
        if not result:
            return jsonify({'error': 'Configuration not found'}), 404
        
        return jsonify({
            'message': 'Configuration status toggled successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_config_bp.route('/<config_id>', methods=['DELETE'])
def delete_config(config_id):
    """Delete a configuration"""
    try:
        config_model = SystemConfig(request.db)
        result = config_model.delete_config(config_id)
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Configuration not found'}), 404
        
        return jsonify({
            'message': 'Configuration deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
