from flask import Blueprint, request, jsonify
from models.voice_generation_job import VoiceGenerationJob
from datetime import datetime
from bson import ObjectId

voice_jobs_bp = Blueprint('voice_generation_jobs', __name__)

@voice_jobs_bp.route('/', methods=['POST'])
def create_job():
    """Create a new voice generation job"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'promptId', 'voiceSettings']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        job_model = VoiceGenerationJob(request.db)
        job_id = job_model.create_job(data)
        
        return jsonify({
            'message': 'Voice generation job created successfully',
            'job_id': job_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    """Get a specific job by ID"""
    try:
        job_model = VoiceGenerationJob(request.db)
        job = job_model.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        job['_id'] = str(job['_id'])
        if 'userId' in job:
            job['userId'] = str(job['userId'])
        if 'promptId' in job:
            job['promptId'] = str(job['promptId'])
        
        return jsonify({'job': job}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/user/<user_id>', methods=['GET'])
def get_jobs_by_user(user_id):
    """Get jobs for a user with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        job_model = VoiceGenerationJob(request.db)
        jobs = job_model.get_jobs_by_user(user_id, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
            if 'userId' in job:
                job['userId'] = str(job['userId'])
            if 'promptId' in job:
                job['promptId'] = str(job['promptId'])
        
        return jsonify({
            'jobs': jobs,
            'count': len(jobs),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/status/<status>', methods=['GET'])
def get_jobs_by_status(status):
    """Get jobs by status"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        job_model = VoiceGenerationJob(request.db)
        jobs = job_model.get_jobs_by_status(status, limit, skip)
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
            if 'userId' in job:
                job['userId'] = str(job['userId'])
            if 'promptId' in job:
                job['promptId'] = str(job['promptId'])
        
        return jsonify({
            'jobs': jobs,
            'count': len(jobs),
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/<job_id>/status', methods=['PUT'])
def update_job_status(job_id):
    """Update job status and progress"""
    try:
        data = request.get_json()
        status = data.get('status')
        progress = data.get('progress')
        error_message = data.get('errorMessage')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        job_model = VoiceGenerationJob(request.db)
        result = job_model.update_job_status(job_id, status, progress, error_message)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({
            'message': 'Job status updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/<job_id>/progress', methods=['PUT'])
def update_job_progress(job_id):
    """Update job progress"""
    try:
        data = request.get_json()
        progress = data.get('progress')
        
        if progress is None:
            return jsonify({'error': 'Progress is required'}), 400
        
        job_model = VoiceGenerationJob(request.db)
        result = job_model.update_job_progress(job_id, progress)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({
            'message': 'Job progress updated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/<job_id>/retry', methods=['POST'])
def retry_job(job_id):
    """Retry a failed job"""
    try:
        job_model = VoiceGenerationJob(request.db)
        result = job_model.increment_retry_count(job_id)
        
        if result.matched_count == 0:
            return jsonify({'error': 'Job not found'}), 404
        
        # Reset status to pending for retry
        job_model.update_job_status(job_id, 'pending', 0)
        
        return jsonify({
            'message': 'Job retry initiated successfully',
            'modified_count': result.modified_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/failed', methods=['GET'])
def get_failed_jobs():
    """Get failed jobs for retry"""
    try:
        limit = int(request.args.get('limit', 10))
        
        job_model = VoiceGenerationJob(request.db)
        jobs = job_model.get_failed_jobs(limit)
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
            if 'userId' in job:
                job['userId'] = str(job['userId'])
            if 'promptId' in job:
                job['promptId'] = str(job['promptId'])
        
        return jsonify({
            'jobs': jobs,
            'count': len(jobs)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_jobs_bp.route('/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job"""
    try:
        job_model = VoiceGenerationJob(request.db)
        result = job_model.delete_job(job_id)
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({
            'message': 'Job deleted successfully',
            'deleted_count': result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
