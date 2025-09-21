from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class Prompt:
    def __init__(self, db):
        self.collection = db.userPrompts
    
    def create_prompt(self, prompt_data):
        """Create a new user prompt"""
        # Convert userId string to ObjectId
        if 'userId' in prompt_data:
            prompt_data['userId'] = ObjectId(prompt_data['userId'])
        
        prompt_data['createdAt'] = datetime.utcnow()
        prompt_data['processing'] = {
            'status': 'pending',
            'priority': 5,
            'assignedTo': prompt_data.get('processing', {}).get('assignedTo', 'system')
        }
        
        result = self.collection.insert_one(prompt_data)
        return str(result.inserted_id)
    
    def get_prompts_by_user(self, user_id):
        """Get all prompts for a user"""
        return list(self.collection.find({'userId': ObjectId(user_id)}))
    
    def update_prompt_status(self, prompt_id, status, assigned_to=None):
        """Update prompt processing status"""
        update_data = {'processing.status': status}
        if assigned_to:
            update_data['processing.assignedTo'] = assigned_to
        
        return self.collection.update_one(
            {'_id': ObjectId(prompt_id)},
            {'$set': update_data}
        )