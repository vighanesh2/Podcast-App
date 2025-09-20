# MongoDB Connection Guide for Podcast Application

## 🔌 Connecting to MongoDB Compass

### Step 1: Open MongoDB Compass
1. Launch MongoDB Compass from your desktop
2. You should see the connection screen

### Step 2: Connect to Local MongoDB
If you have MongoDB running locally:
- **Connection String**: `mongodb://localhost:27017`
- Click "Connect" to establish connection

### Step 3: Connect to Remote MongoDB (if applicable)
If using a cloud MongoDB service (MongoDB Atlas, etc.):
- **Connection String**: `mongodb+srv://username:password@cluster.mongodb.net/`
- Replace `username`, `password`, and `cluster` with your actual credentials

## 🗄️ Database Setup

### Step 1: Create the Database
1. In MongoDB Compass, click "Create Database"
2. **Database Name**: `podcastDB`
3. **Collection Name**: `users` (we'll create others via script)
4. Click "Create Database"

### Step 2: Run Setup Scripts
1. In MongoDB Compass, go to the "MongoSH" tab (bottom panel)
2. Copy and paste the contents of `mongodb-setup.js`
3. Press Enter to execute
4. Wait for "✅ All collections created successfully with validation rules!"

### Step 3: Insert Sample Data
1. Copy and paste the contents of `sample-data.js`
2. Press Enter to execute
3. Wait for "🎉 Sample data insertion completed successfully!"

## 📊 Verifying Your Setup

### Check Collections
```javascript
// In MongoDB Compass MongoSH tab
use podcastDB;
show collections;
```

You should see:
- analytics
- contentTemplates
- podcastEpisodes
- rssFeeds
- systemConfig
- userPrompts
- users
- voiceGenerationJobs

### Check Sample Data
```javascript
// Count documents in each collection
db.users.countDocuments();
db.userPrompts.countDocuments();
db.podcastEpisodes.countDocuments();
db.rssFeeds.countDocuments();
db.analytics.countDocuments();
```

## 🔍 Exploring Your Data

### Browse Collections
1. In the left sidebar, expand `podcastDB`
2. Click on any collection to view its documents
3. Use the filter and projection features to explore data

### Run Example Queries
1. Go to the "MongoSH" tab
2. Copy and paste queries from `database-queries.js`
3. Modify queries to explore different aspects of your data

## 🛠️ Common Operations

### View All Users
```javascript
db.users.find().pretty();
```

### Find Episodes by Status
```javascript
db.podcastEpisodes.find({ status: "published" }).pretty();
```

### Get Analytics Summary
```javascript
db.analytics.aggregate([
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 }
    }
  }
]);
```

## 🔧 Troubleshooting

### Connection Issues
- **Error**: "Connection refused"
  - **Solution**: Ensure MongoDB is running locally or check connection string
- **Error**: "Authentication failed"
  - **Solution**: Verify username and password for remote connections

### Script Execution Issues
- **Error**: "Syntax error"
  - **Solution**: Ensure you're copying the entire script without modifications
- **Error**: "Collection already exists"
  - **Solution**: This is normal if you've run the script before

### Data Not Appearing
- **Issue**: Collections created but no data
  - **Solution**: Ensure you ran both `mongodb-setup.js` AND `sample-data.js`
- **Issue**: Validation errors
  - **Solution**: Check that your MongoDB version supports the validation syntax

## 📈 Performance Tips

### Indexing
The setup script automatically creates indexes for optimal performance:
- User lookups by email/username
- Prompt processing by status and priority
- Episode queries by status and publication date
- Analytics queries by type and timestamp

### Query Optimization
- Use projection to limit returned fields
- Use appropriate filters to reduce result sets
- Leverage aggregation pipelines for complex queries

## 🔒 Security Considerations

### Local Development
- MongoDB running locally is typically not secured
- Suitable for development and testing only

### Production Deployment
- Enable authentication
- Use SSL/TLS connections
- Implement proper user roles and permissions
- Regular security updates

## 📱 Integration with Your Application

### Connection String for Your App
```javascript
// Node.js example
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/podcastDB');

// Python example
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['podcastDB']
```

### Environment Variables
```bash
# .env file
MONGODB_URI=mongodb://localhost:27017/podcastDB
MONGODB_DATABASE=podcastDB
```

## 🎯 Next Steps

1. **Explore the Data**: Use MongoDB Compass to browse through the sample data
2. **Test Queries**: Try the example queries from `database-queries.js`
3. **Customize**: Modify the schema to fit your specific needs
4. **Integrate**: Connect your application to the database
5. **Scale**: Consider MongoDB Atlas for production deployment

## 📚 Additional Resources

- [MongoDB Compass Documentation](https://docs.mongodb.com/compass/)
- [MongoDB Shell (mongosh) Guide](https://docs.mongodb.com/mongodb-shell/)
- [MongoDB Aggregation Framework](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Indexes Guide](https://docs.mongodb.com/manual/indexes/)

## 🆘 Getting Help

If you encounter issues:
1. Check the MongoDB Compass logs
2. Verify your MongoDB version compatibility
3. Ensure all scripts ran without errors
4. Check the database and collection names match exactly

Happy podcasting! 🎙️
