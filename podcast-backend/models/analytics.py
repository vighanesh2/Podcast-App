from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId

class Analytics:
    def __init__(self, db):
        self.collection = db.analytics
    
    def create_analytics_record(self, analytics_data):
        """Create a new analytics record"""
        # Convert userId and episodeId strings to ObjectId
        if 'userId' in analytics_data:
            analytics_data['userId'] = ObjectId(analytics_data['userId'])
        if 'episodeId' in analytics_data:
            analytics_data['episodeId'] = ObjectId(analytics_data['episodeId'])
        
        # Map 'view' to 'episode_play' if needed
        if analytics_data.get('type') == 'view':
            analytics_data['type'] = 'episode_play'
        
        # Add event field if not provided
        if 'event' not in analytics_data:
            analytics_data['event'] = {
                'action': analytics_data.get('type', 'episode_play'),
                'timestamp': datetime.utcnow(),
                'metadata': {}
            }
        
        analytics_data['createdAt'] = datetime.utcnow()
        analytics_data['timestamp'] = datetime.utcnow()
        
        result = self.collection.insert_one(analytics_data)
        return str(result.inserted_id)
    
    def get_analytics_by_id(self, analytics_id):
        """Get analytics record by ID"""
        return self.collection.find_one({'_id': ObjectId(analytics_id)})
    
    def get_analytics_by_user(self, user_id, limit=10, skip=0):
        """Get analytics for a user with pagination"""
        return list(self.collection.find({'userId': ObjectId(user_id)})
                   .sort('timestamp', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_analytics_by_type(self, analytics_type, limit=10, skip=0):
        """Get analytics by type"""
        return list(self.collection.find({'type': analytics_type})
                   .sort('timestamp', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_analytics_by_date_range(self, start_date, end_date, limit=100, skip=0):
        """Get analytics within date range"""
        return list(self.collection.find({
            'timestamp': {
                '$gte': start_date,
                '$lte': end_date
            }
        }).sort('timestamp', -1)
        .skip(skip)
        .limit(limit))
    
    def get_user_analytics_summary(self, user_id, days=30):
        """Get user analytics summary for specified days"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        pipeline = [
            {
                '$match': {
                    'userId': ObjectId(user_id),
                    'timestamp': {'$gte': start_date, '$lte': end_date}
                }
            },
            {
                '$group': {
                    '_id': '$type',
                    'count': {'$sum': 1},
                    'totalValue': {'$sum': '$value'}
                }
            }
        ]
        
        return list(self.collection.aggregate(pipeline))
    
    def get_episode_analytics(self, episode_id, limit=50, skip=0):
        """Get analytics for a specific episode"""
        return list(self.collection.find({'episodeId': ObjectId(episode_id)})
                   .sort('timestamp', -1)
                   .skip(skip)
                   .limit(limit))
    
    def track_interaction(self, user_id, interaction_type, episode_id=None, metadata=None):
        """Track user interaction"""
        interaction_data = {
            'userId': ObjectId(user_id),
            'type': interaction_type,
            'timestamp': datetime.utcnow(),
            'createdAt': datetime.utcnow()
        }
        
        if episode_id:
            interaction_data['episodeId'] = ObjectId(episode_id)
        
        if metadata:
            interaction_data['metadata'] = metadata
        
        result = self.collection.insert_one(interaction_data)
        return str(result.inserted_id)
    
    def get_popular_episodes(self, limit=10, days=30):
        """Get most popular episodes based on analytics"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        pipeline = [
            {
                '$match': {
                    'type': {'$in': ['view', 'like', 'share', 'download']},
                    'timestamp': {'$gte': start_date, '$lte': end_date}
                }
            },
            {
                '$group': {
                    '_id': '$episodeId',
                    'totalInteractions': {'$sum': 1},
                    'views': {
                        '$sum': {'$cond': [{'$eq': ['$type', 'view']}, 1, 0]}
                    },
                    'likes': {
                        '$sum': {'$cond': [{'$eq': ['$type', 'like']}, 1, 0]}
                    },
                    'shares': {
                        '$sum': {'$cond': [{'$eq': ['$type', 'share']}, 1, 0]}
                    },
                    'downloads': {
                        '$sum': {'$cond': [{'$eq': ['$type', 'download']}, 1, 0]}
                    }
                }
            },
            {
                '$sort': {'totalInteractions': -1}
            },
            {
                '$limit': limit
            }
        ]
        
        return list(self.collection.aggregate(pipeline))
    
    def delete_old_analytics(self, days=90):
        """Delete analytics older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return self.collection.delete_many({
            'timestamp': {'$lt': cutoff_date}
        })
