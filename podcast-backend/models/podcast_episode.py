from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class PodcastEpisode:
    def __init__(self, db):
        self.collection = db.podcastEpisodes
    
    def create_episode(self, episode_data):
        """Create a new podcast episode"""
        # Convert userId and createdBy strings to ObjectId
        if 'userId' in episode_data:
            episode_data['userId'] = ObjectId(episode_data['userId'])
        if 'createdBy' in episode_data:
            episode_data['createdBy'] = ObjectId(episode_data['createdBy'])
        
        # Convert script string to object if it's a string
        if 'script' in episode_data and isinstance(episode_data['script'], str):
            episode_data['script'] = {
                'content': episode_data['script'],
                'segments': [
                    {
                        'type': 'intro',
                        'content': episode_data['script'],
                        'timestamp': 0,
                        'duration': 30
                    }
                ],
                'version': 1,
                'lastModified': datetime.utcnow()
            }
        
        episode_data['createdAt'] = datetime.utcnow()
        episode_data['updatedAt'] = datetime.utcnow()
        episode_data['status'] = episode_data.get('status', 'draft')
        episode_data['analytics'] = {
            'views': 0,
            'likes': 0,
            'shares': 0,
            'downloads': 0
        }
        
        result = self.collection.insert_one(episode_data)
        return str(result.inserted_id)
    
    def get_episode_by_id(self, episode_id):
        """Get episode by ID"""
        return self.collection.find_one({'_id': ObjectId(episode_id)})
    
    def get_episodes_by_user(self, user_id, limit=10, skip=0):
        """Get episodes for a user with pagination"""
        return list(self.collection.find({'userId': ObjectId(user_id)})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_episodes_by_status(self, status, limit=10, skip=0):
        """Get episodes by status"""
        return list(self.collection.find({'status': status})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def update_episode(self, episode_id, update_data):
        """Update episode"""
        update_data['updatedAt'] = datetime.utcnow()
        return self.collection.update_one(
            {'_id': ObjectId(episode_id)},
            {'$set': update_data}
        )
    
    def delete_episode(self, episode_id):
        """Delete episode"""
        return self.collection.delete_one({'_id': ObjectId(episode_id)})
    
    def update_analytics(self, episode_id, analytics_data):
        """Update episode analytics"""
        return self.collection.update_one(
            {'_id': ObjectId(episode_id)},
            {'$set': {'analytics': analytics_data}}
        )
    
    def increment_analytics(self, episode_id, field, increment=1):
        """Increment analytics field"""
        return self.collection.update_one(
            {'_id': ObjectId(episode_id)},
            {'$inc': {f'analytics.{field}': increment}}
        )
