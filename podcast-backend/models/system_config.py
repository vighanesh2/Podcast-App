from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class SystemConfig:
    def __init__(self, db):
        self.collection = db.systemConfig
    
    def create_config(self, config_data):
        """Create a new system configuration"""
        # Map category to valid enum value
        if config_data.get('category') == 'limits':
            config_data['category'] = 'general'
        
        # Add type field if not provided
        if 'type' not in config_data:
            config_data['type'] = 'string'
        
        config_data['createdAt'] = datetime.utcnow()
        config_data['updatedAt'] = datetime.utcnow()
        config_data['isActive'] = config_data.get('isActive', True)
        
        result = self.collection.insert_one(config_data)
        return str(result.inserted_id)
    
    def get_config_by_id(self, config_id):
        """Get config by ID"""
        return self.collection.find_one({'_id': ObjectId(config_id)})
    
    def get_config_by_key(self, key):
        """Get config by key"""
        return self.collection.find_one({'key': key})
    
    def get_all_configs(self, limit=50, skip=0):
        """Get all configurations with pagination"""
        return list(self.collection.find()
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_active_configs(self, limit=50, skip=0):
        """Get active configurations"""
        return list(self.collection.find({'isActive': True})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def update_config(self, config_id, update_data):
        """Update configuration"""
        update_data['updatedAt'] = datetime.utcnow()
        return self.collection.update_one(
            {'_id': ObjectId(config_id)},
            {'$set': update_data}
        )
    
    def update_config_by_key(self, key, value):
        """Update configuration by key"""
        return self.collection.update_one(
            {'key': key},
            {'$set': {
                'value': value,
                'updatedAt': datetime.utcnow()
            }},
            upsert=True
        )
    
    def toggle_active_status(self, config_id):
        """Toggle config active status"""
        config = self.get_config_by_id(config_id)
        if config:
            new_status = not config.get('isActive', True)
            return self.collection.update_one(
                {'_id': ObjectId(config_id)},
                {'$set': {
                    'isActive': new_status,
                    'updatedAt': datetime.utcnow()
                }}
            )
        return None
    
    def delete_config(self, config_id):
        """Delete configuration"""
        return self.collection.delete_one({'_id': ObjectId(config_id)})
    
    def get_configs_by_category(self, category, limit=20, skip=0):
        """Get configurations by category"""
        return list(self.collection.find({'category': category})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def bulk_update_configs(self, configs_data):
        """Bulk update multiple configurations"""
        operations = []
        for config in configs_data:
            operations.append({
                'updateOne': {
                    'filter': {'key': config['key']},
                    'update': {
                        '$set': {
                            'value': config['value'],
                            'updatedAt': datetime.utcnow()
                        }
                    },
                    'upsert': True
                }
            })
        
        if operations:
            return self.collection.bulk_write(operations)
        return None
