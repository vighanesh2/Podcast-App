from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class RSSFeed:
    def __init__(self, db):
        self.collection = db.rssFeeds
    
    def create_feed(self, feed_data):
        """Create a new RSS feed"""
        # Convert userId to ownerId and handle field mapping
        if 'userId' in feed_data:
            feed_data['ownerId'] = ObjectId(feed_data['userId'])
            del feed_data['userId']
        
        # Map title to name if needed
        if 'title' in feed_data and 'name' not in feed_data:
            feed_data['name'] = feed_data['title']
            del feed_data['title']
        
        # Map feedUrl to url if needed
        if 'feedUrl' in feed_data and 'url' not in feed_data:
            feed_data['url'] = feed_data['feedUrl']
            del feed_data['feedUrl']
        
        feed_data['createdAt'] = datetime.utcnow()
        feed_data['updatedAt'] = datetime.utcnow()
        feed_data['status'] = feed_data.get('status', 'active')
        feed_data['config'] = feed_data.get('config', {
            'title': feed_data.get('name', 'My Podcast Feed'),
            'description': feed_data.get('description', 'My podcast RSS feed'),
            'language': 'en',
            'autoSync': True,
            'syncInterval': 3600,
            'maxEpisodes': 100
        })
        feed_data['lastSync'] = None
        feed_data['syncCount'] = 0
        
        result = self.collection.insert_one(feed_data)
        return str(result.inserted_id)
    
    def get_feed_by_id(self, feed_id):
        """Get feed by ID"""
        return self.collection.find_one({'_id': ObjectId(feed_id)})
    
    def get_feeds_by_user(self, user_id, limit=10, skip=0):
        """Get feeds for a user with pagination"""
        return list(self.collection.find({'userId': ObjectId(user_id)})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_active_feeds(self, limit=10, skip=0):
        """Get active feeds"""
        return list(self.collection.find({'isActive': True})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def update_feed(self, feed_id, update_data):
        """Update feed"""
        update_data['updatedAt'] = datetime.utcnow()
        return self.collection.update_one(
            {'_id': ObjectId(feed_id)},
            {'$set': update_data}
        )
    
    def update_sync_info(self, feed_id, last_sync, sync_count):
        """Update sync information"""
        return self.collection.update_one(
            {'_id': ObjectId(feed_id)},
            {'$set': {
                'lastSync': last_sync,
                'syncCount': sync_count,
                'updatedAt': datetime.utcnow()
            }}
        )
    
    def toggle_active_status(self, feed_id):
        """Toggle feed active status"""
        feed = self.get_feed_by_id(feed_id)
        if feed:
            new_status = not feed.get('isActive', True)
            return self.collection.update_one(
                {'_id': ObjectId(feed_id)},
                {'$set': {
                    'isActive': new_status,
                    'updatedAt': datetime.utcnow()
                }}
            )
        return None
    
    def delete_feed(self, feed_id):
        """Delete feed"""
        return self.collection.delete_one({'_id': ObjectId(feed_id)})
    
    def search_feeds(self, query, limit=10, skip=0):
        """Search feeds by title or description"""
        search_filter = {
            '$or': [
                {'title': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}}
            ]
        }
        return list(self.collection.find(search_filter)
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
