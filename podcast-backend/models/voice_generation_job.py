from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class VoiceGenerationJob:
    def __init__(self, db):
        self.collection = db.voiceGenerationJobs
    
    def create_job(self, job_data):
        """Create a new voice generation job"""
        # Convert userId, promptId, and episodeId strings to ObjectId
        if 'userId' in job_data:
            job_data['userId'] = ObjectId(job_data['userId'])
        if 'promptId' in job_data:
            job_data['promptId'] = ObjectId(job_data['promptId'])
        if 'episodeId' in job_data:
            job_data['episodeId'] = ObjectId(job_data['episodeId'])
        
        job_data['createdAt'] = datetime.utcnow()
        job_data['updatedAt'] = datetime.utcnow()
        job_data['status'] = job_data.get('status', 'queued')
        job_data['progress'] = 0
        job_data['retryCount'] = 0
        job_data['maxRetries'] = job_data.get('maxRetries', 3)
        job_data['priority'] = job_data.get('priority', 5)
        
        # Convert voiceSettings to voiceConfig if needed
        if 'voiceSettings' in job_data and 'voiceConfig' not in job_data:
            job_data['voiceConfig'] = {
                'voiceId': job_data['voiceSettings'].get('voice', 'en-US-AriaNeural'),
                'provider': 'azure',
                'speed': job_data['voiceSettings'].get('speed', 1.0)
            }
        
        # Add episodeId if not provided (use a default for testing)
        if 'episodeId' not in job_data:
            job_data['episodeId'] = ObjectId('507f1f77bcf86cd799439013')
        
        result = self.collection.insert_one(job_data)
        return str(result.inserted_id)
    
    def get_job_by_id(self, job_id):
        """Get job by ID"""
        return self.collection.find_one({'_id': ObjectId(job_id)})
    
    def get_jobs_by_user(self, user_id, limit=10, skip=0):
        """Get jobs for a user with pagination"""
        return list(self.collection.find({'userId': ObjectId(user_id)})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_jobs_by_status(self, status, limit=10, skip=0):
        """Get jobs by status"""
        return list(self.collection.find({'status': status})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def update_job_status(self, job_id, status, progress=None, error_message=None):
        """Update job status and progress"""
        update_data = {
            'status': status,
            'updatedAt': datetime.utcnow()
        }
        
        if progress is not None:
            update_data['progress'] = progress
        
        if error_message:
            update_data['errorMessage'] = error_message
        
        return self.collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': update_data}
        )
    
    def update_job_progress(self, job_id, progress):
        """Update job progress"""
        return self.collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': {
                'progress': progress,
                'updatedAt': datetime.utcnow()
            }}
        )
    
    def increment_retry_count(self, job_id):
        """Increment retry count"""
        return self.collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$inc': {'retryCount': 1}}
        )
    
    def delete_job(self, job_id):
        """Delete job"""
        return self.collection.delete_one({'_id': ObjectId(job_id)})
    
    def get_failed_jobs(self, limit=10):
        """Get failed jobs for retry"""
        return list(self.collection.find({
            'status': 'failed',
            'retryCount': {'$lt': '$maxRetries'}
        }).limit(limit))
