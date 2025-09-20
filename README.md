# Humorous Podcast Database

A comprehensive MongoDB database designed for a humorous podcast application that converts user prompts and ideas into entertaining podcast content.

## 🎯 Overview

This database supports a multi-team podcast application with:
- **Frontend Team**: User management, content display, and interaction tracking
- **RSS Feed Team**: Podcast distribution and feed management
- **Voice Generation Team**: AI-powered audio content creation
- **Analytics Team**: Performance tracking and user engagement metrics

## 🗄️ Database Structure

### Collections

1. **Users** - User accounts, preferences, and subscription management
2. **User Prompts** - User-submitted ideas and prompts for podcast content
3. **Podcast Episodes** - Generated podcast episodes with scripts and audio
4. **Voice Generation Jobs** - Audio generation tasks and processing status
5. **RSS Feeds** - Podcast feed configuration and distribution
6. **Analytics** - User engagement and performance tracking
7. **Content Templates** - Reusable content templates for different humor styles
8. **System Configuration** - Application settings and configuration

## 🚀 Quick Start

### Prerequisites
- MongoDB Compass installed on your desktop
- MongoDB server running locally or accessible remotely

### Setup Instructions

1. **Create the Database and Collections**
   ```bash
   # In MongoDB Compass or MongoDB Shell
   use podcastDB;
   # Then run the setup script
   load("mongodb-setup.js");
   ```

2. **Insert Sample Data**
   ```bash
   # Run the sample data script
   load("sample-data.js");
   ```

3. **Test with Example Queries**
   ```bash
   # Run example queries
   load("database-queries.js");
   ```

## 📊 Key Features

### User Management
- User profiles with humor style preferences
- Subscription tiers (Free, Premium, Pro)
- User statistics and activity tracking

### Content Creation
- Prompt processing with AI integration
- Multi-segment podcast scripts
- Humor level classification (1-10 scale)
- Content categorization and tagging

### Voice Generation
- Multiple voice providers support (ElevenLabs, Azure, AWS Polly)
- Voice customization settings
- Job queue management with priority system
- Error handling and retry mechanisms

### RSS Feed Management
- Multiple feed support per user
- Automated publishing schedules
- Feed statistics and subscriber tracking
- Custom feed configuration

### Analytics & Insights
- Comprehensive event tracking
- User engagement metrics
- Content performance analysis
- Geographic and device analytics

## 🔧 Configuration

### Voice Generation Settings
```javascript
{
  provider: "elevenlabs",
  voiceId: "sarcastic_male_01",
  speed: 1.1,
  pitch: 1.0,
  emotion: "sarcastic",
  stability: 0.8,
  clarity: 0.9
}
```

### RSS Feed Configuration
```javascript
{
  title: "Comedy King's Daily Dose",
  description: "Daily doses of sarcastic humor",
  language: "en",
  category: "Comedy",
  explicit: false,
  autoPublish: true,
  schedule: "0 8 * * *" // Daily at 8 AM
}
```

## 📈 Analytics Dashboard Queries

### Top Performing Episodes
```javascript
db.podcastEpisodes.aggregate([
  { $match: { status: "published" } },
  {
    $addFields: {
      totalEngagement: {
        $add: [
          "$analytics.downloads",
          "$analytics.plays", 
          "$analytics.shares",
          "$analytics.likes"
        ]
      }
    }
  },
  { $sort: { totalEngagement: -1 } },
  { $limit: 10 }
]);
```

### User Engagement Trends
```javascript
db.analytics.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$event.timestamp" },
        month: { $month: "$event.timestamp" }
      },
      totalEvents: { $sum: 1 },
      uniqueUsers: { $addToSet: "$userId" }
    }
  },
  {
    $project: {
      month: "$_id.month",
      totalEvents: 1,
      uniqueUserCount: { $size: "$uniqueUsers" }
    }
  }
]);
```

## 🎭 Humor Styles Supported

- **Sarcastic**: Witty, cutting observations
- **Witty**: Clever wordplay and smart humor
- **Absurd**: Surreal, unexpected humor
- **Observational**: Everyday life observations
- **Dark**: Edgy, controversial humor
- **Wholesome**: Clean, family-friendly humor

## 🔍 Content Categories

- **News**: Current events and trending topics
- **Personal**: Personal experiences and stories
- **Random**: Spontaneous thoughts and ideas
- **Trending**: Popular topics and viral content
- **Comedy**: Pure comedic content
- **Story**: Narrative-driven content
- **Observation**: Social and behavioral observations

## 📱 API Integration Examples

### Create New User
```javascript
db.users.insertOne({
  username: "new_user",
  email: "user@example.com",
  profile: {
    displayName: "New User",
    preferences: {
      humorStyle: "witty",
      language: "en",
      timezone: "UTC"
    }
  },
  subscription: {
    plan: "free"
  },
  stats: {
    totalPrompts: 0,
    totalEpisodes: 0,
    favoriteEpisodes: []
  },
  createdAt: new Date(),
  lastActive: new Date()
});
```

### Process User Prompt
```javascript
db.userPrompts.insertOne({
  userId: ObjectId("USER_ID"),
  prompt: "Why do we park in driveways and drive on parkways?",
  category: "observation",
  mood: "witty",
  context: {
    tags: ["language", "observation", "wordplay"],
    source: "web",
    originalLength: 65
  },
  processing: {
    status: "pending",
    priority: 5,
    assignedTo: null
  },
  createdAt: new Date()
});
```

### Generate Podcast Episode
```javascript
db.podcastEpisodes.insertOne({
  title: "The Driveway Paradox",
  description: "Exploring the linguistic absurdity of parking terminology",
  episodeNumber: 1,
  season: 1,
  status: "processing",
  script: {
    segments: [
      {
        type: "intro",
        content: "Welcome to Witty Observations...",
        duration: 30,
        humorLevel: 8
      }
    ],
    totalWords: 150,
    estimatedDuration: 300
  },
  sourcePrompts: [ObjectId("PROMPT_ID")],
  createdBy: ObjectId("USER_ID"),
  createdAt: new Date()
});
```

## 🛠️ Maintenance

### Regular Tasks
- Monitor voice generation job failures
- Clean up old analytics data
- Update RSS feeds
- Backup user data

### Performance Optimization
- Index monitoring and optimization
- Query performance analysis
- Storage usage monitoring
- Connection pool management

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass Guide](https://docs.mongodb.com/compass/)
- [Aggregation Pipeline Guide](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

## 🤝 Team Integration

### Frontend Team
- User authentication and profile management
- Content display and interaction
- Real-time analytics dashboard

### RSS Feed Team
- Feed generation and validation
- Distribution management
- Subscriber analytics

### Voice Generation Team
- Audio processing pipeline
- Voice quality optimization
- Job queue management

### Analytics Team
- Performance metrics collection
- User behavior analysis
- Content optimization insights

## 📞 Support

For questions about the database design or implementation, refer to the schema documentation in `database-schema.md` or the example queries in `database-queries.js`.
