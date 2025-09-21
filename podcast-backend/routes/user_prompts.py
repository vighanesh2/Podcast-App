from flask import Blueprint, request, jsonify
from models.prompt import Prompt
from datetime import datetime
from bson import ObjectId

user_prompts_bp = Blueprint('user_prompts', __name__)

@user_prompts_bp.route('/', methods=['POST'])
def create_prompt():
    """Create a new user prompt"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'prompt', 'category', 'mood']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        prompt_model = Prompt(request.db)
        prompt_id = prompt_model.create_prompt(data)
        
        return jsonify({
            'message': 'Prompt created successfully',
            'prompt_id': prompt_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_prompts_bp.route('/user/<user_id>', methods=['GET'])
def get_prompts_by_user(user_id):
    """Get all prompts for a user"""
    try:
        prompt_model = Prompt(request.db)
        prompts = prompt_model.get_prompts_by_user(user_id)
        
        # Convert ObjectId to string for JSON serialization
        for prompt in prompts:
            prompt['_id'] = str(prompt['_id'])
            if 'userId' in prompt:
                prompt['userId'] = str(prompt['userId'])
        
        return jsonify({
            'prompts': prompts,
            'count': len(prompts)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_prompts_bp.route('/<prompt_id>', methods=['GET'])
def get_prompt(prompt_id):
    """Get a specific prompt by ID"""
    try:
        prompt_model = Prompt(request.db)
        prompt = prompt_model.get_prompt_by_id(prompt_id)
        
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        prompt['_id'] = str(prompt['_id'])
        if 'userId' in prompt:
            prompt['userId'] = str(prompt['userId'])
        
        return jsonify({'prompt': prompt}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_prompts_bp.route('/<prompt_id>/status', methods=['PUT'])
def update_prompt_status(prompt_id):
    """Update prompt processing status"""
    try:
        data = request.get_json()
        status = data.get('status')
        assigned_to = data.get('assignedTo')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        prompt_model = Prompt(request.db)
        result = prompt_model.update_prompt_status(prompt_id, status, assigned_to)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Prompt not found'}), 404
        
        return jsonify({
            'message': 'Prompt status updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_prompts_bp.route('/<prompt_id>', methods=['PUT'])
def update_prompt(prompt_id):
    """Update a prompt"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.utcnow()
        
        prompt_model = Prompt(request.db)
        result = prompt_model.collection.update_one(
            {'_id': ObjectId(prompt_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Prompt not found'}), 404
        
        return jsonify({
            'message': 'Prompt updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_prompts_bp.route('/<prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Delete a prompt"""
    try:
        prompt_model = Prompt(request.db)
        result = prompt_model.collection.delete_one({'_id': ObjectId(prompt_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Prompt not found'}), 404
        
        return jsonify({
            'message': 'Prompt deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
