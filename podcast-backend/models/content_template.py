from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

class ContentTemplate:
    def __init__(self, db):
        self.collection = db.contentTemplates
    
    def create_template(self, template_data):
        """Create a new content template"""
        # Convert userId to createdBy and handle field mapping
        if 'userId' in template_data:
            template_data['createdBy'] = ObjectId(template_data['userId'])
            del template_data['userId']
        
        # Map title to name if needed
        if 'title' in template_data and 'name' not in template_data:
            template_data['name'] = template_data['title']
            del template_data['title']
        
        # Map content to template if needed
        if 'content' in template_data and 'template' not in template_data:
            template_data['template'] = {
                'script': template_data['content'],
                'structure': [
                    {
                        'type': 'intro',
                        'placeholder': 'intro_placeholder',
                        'content': 'Welcome to our podcast...',
                        'duration': 10
                    },
                    {
                        'type': 'main',
                        'placeholder': 'main_placeholder',
                        'content': template_data['content'],
                        'duration': 300
                    },
                    {
                        'type': 'outro',
                        'placeholder': 'outro_placeholder',
                        'content': 'Thanks for listening!',
                        'duration': 10
                    }
                ],
                'version': 1,
                'lastModified': datetime.utcnow()
            }
            del template_data['content']
        
        # Map category to valid enum value
        if template_data.get('category') == 'technology':
            template_data['category'] = 'news'
        
        # Add description if not provided
        if 'description' not in template_data:
            template_data['description'] = f"Template for {template_data.get('name', 'content')}"
        
        template_data['createdAt'] = datetime.utcnow()
        template_data['updatedAt'] = datetime.utcnow()
        template_data['isActive'] = template_data.get('isActive', True)
        template_data['usageCount'] = 0
        
        result = self.collection.insert_one(template_data)
        return str(result.inserted_id)
    
    def get_template_by_id(self, template_id):
        """Get template by ID"""
        return self.collection.find_one({'_id': ObjectId(template_id)})
    
    def get_templates_by_user(self, user_id, limit=10, skip=0):
        """Get templates for a user with pagination"""
        return list(self.collection.find({'userId': ObjectId(user_id)})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_templates_by_category(self, category, limit=10, skip=0):
        """Get templates by category"""
        return list(self.collection.find({'category': category})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_active_templates(self, limit=10, skip=0):
        """Get active templates"""
        return list(self.collection.find({'isActive': True})
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def update_template(self, template_id, update_data):
        """Update template"""
        update_data['updatedAt'] = datetime.utcnow()
        return self.collection.update_one(
            {'_id': ObjectId(template_id)},
            {'$set': update_data}
        )
    
    def increment_usage_count(self, template_id):
        """Increment template usage count"""
        return self.collection.update_one(
            {'_id': ObjectId(template_id)},
            {'$inc': {'usageCount': 1}}
        )
    
    def toggle_active_status(self, template_id):
        """Toggle template active status"""
        template = self.get_template_by_id(template_id)
        if template:
            new_status = not template.get('isActive', True)
            return self.collection.update_one(
                {'_id': ObjectId(template_id)},
                {'$set': {
                    'isActive': new_status,
                    'updatedAt': datetime.utcnow()
                }}
            )
        return None
    
    def delete_template(self, template_id):
        """Delete template"""
        return self.collection.delete_one({'_id': ObjectId(template_id)})
    
    def search_templates(self, query, limit=10, skip=0):
        """Search templates by title or description"""
        search_filter = {
            '$or': [
                {'title': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}},
                {'content': {'$regex': query, '$options': 'i'}}
            ]
        }
        return list(self.collection.find(search_filter)
                   .sort('createdAt', -1)
                   .skip(skip)
                   .limit(limit))
    
    def get_popular_templates(self, limit=10):
        """Get most popular templates by usage count"""
        return list(self.collection.find({'isActive': True})
                   .sort('usageCount', -1)
                   .limit(limit))
