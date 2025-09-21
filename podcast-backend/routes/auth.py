from flask import Blueprint, request, jsonify
from models.user import User
from datetime import datetime
import hashlib
import secrets

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'profile']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        user_model = User(request.db)
        existing_user = user_model.get_user_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create user
        user_id = user_model.create_user(data)
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login_user():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user_model = User(request.db)
        user = user_model.get_user_by_email(email)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'profile': user['profile']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500