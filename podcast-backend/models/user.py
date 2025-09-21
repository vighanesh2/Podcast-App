from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, db):
        self.collection = db.users
    
    def create_user(self, user_data):
        """Create a new user"""
        user_data['createdAt'] = datetime.utcnow()
        user_data['lastActive'] = datetime.utcnow()
        
        # Add default stats if not provided
        if 'stats' not in user_data:
            user_data['stats'] = {
                'totalPrompts': 0,
                'totalEpisodes': 0,
                'favoriteEpisodes': []
            }
        
        result = self.collection.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        return self.collection.find_one({'_id': ObjectId(user_id)})
    
    def get_user_by_email(self, email):
        """Get user by email"""
        return self.collection.find_one({'email': email})
    
    def update_user_stats(self, user_id, stats_update):
        """Update user statistics"""
        return self.collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'stats': stats_update}}
        )