# Humorous Podcast Database Schema

## Overview
This MongoDB database is designed for a humorous podcast application that converts user prompts/ideas into entertaining podcast content. The database supports multiple teams: frontend, RSS feeds, and voice generation.

## Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  profile: {
    displayName: String,
    avatar: String,
    preferences: {
      humorStyle: String, // "sarcastic", "witty", "absurd", "observational"
      language: String,
      timezone: String
    }
  },
  subscription: {
    plan: String, // "free", "premium", "pro"
    startDate: Date,
    endDate: Date
  },
  stats: {
    totalPrompts: Number,
    totalEpisodes: Number,
    favoriteEpisodes: [ObjectId]
  },
  createdAt: Date,
  lastActive: Date
}
```

### 2. User Prompts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  prompt: String,
  category: String, // "news", "personal", "random", "trending"
  mood: String, // "funny", "sarcastic", "wholesome", "dark"
  context: {
    tags: [String],
    source: String, // "web", "mobile", "api"
    originalLength: Number
  },
  processing: {
    status: String, // "pending", "processing", "completed", "failed"
    priority: Number, // 1-10
    assignedTo: String // "ai_processor_1", "ai_processor_2"
  },
  createdAt: Date,
  processedAt: Date
}
```

### 3. Podcast Episodes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  episodeNumber: Number,
  season: Number,
  duration: Number, // in seconds
  status: String, // "draft", "processing", "ready", "published", "archived"
  
  // Content
  script: {
    segments: [{
      type: String, // "intro", "main_content", "outro", "ad_break"
      content: String,
      duration: Number,
      humorLevel: Number // 1-10
    }],
    totalWords: Number,
    estimatedDuration: Number
  },
  
  // Audio
  audio: {
    filePath: String,
    fileSize: Number,
    format: String, // "mp3", "wav"
    bitrate: Number,
    sampleRate: Number,
    generatedAt: Date,
    voiceSettings: {
      voiceId: String,
      speed: Number,
      pitch: Number,
      emotion: String
    }
  },
  
  // Metadata
  tags: [String],
  category: String,
  explicit: Boolean,
  language: String,
  
  // Relationships
  sourcePrompts: [ObjectId], // ref: User Prompts
  createdBy: ObjectId, // ref: Users
  
  // Publishing
  publishedAt: Date,
  rssFeedId: ObjectId, // ref: RSS Feeds
  
  // Analytics
  analytics: {
    downloads: Number,
    plays: Number,
    shares: Number,
    likes: Number,
    comments: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Voice Generation Jobs Collection
```javascript
{
  _id: ObjectId,
  episodeId: ObjectId (ref: Podcast Episodes),
  status: String, // "queued", "processing", "completed", "failed"
  priority: Number,
  
  // Voice Settings
  voiceConfig: {
    voiceId: String,
    provider: String, // "elevenlabs", "azure", "aws_polly"
    settings: {
      speed: Number,
      pitch: Number,
      emotion: String,
      stability: Number,
      clarity: Number
    }
  },
  
  // Processing Details
  processing: {
    startedAt: Date,
    completedAt: Date,
    duration: Number, // processing time in seconds
    retryCount: Number,
    errorMessage: String
  },
  
  // Output
  output: {
    filePath: String,
    fileSize: Number,
    quality: String, // "standard", "high", "premium"
    format: String
  },
  
  createdAt: Date
}
```

### 5. RSS Feeds Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  url: String (unique),
  ownerId: ObjectId (ref: Users),
  
  // Feed Configuration
  config: {
    title: String,
    description: String,
    language: String,
    category: String,
    explicit: Boolean,
    image: String,
    author: String,
    email: String
  },
  
  // Publishing Settings
  publishing: {
    autoPublish: Boolean,
    schedule: String, // cron expression
    maxEpisodes: Number,
    retentionDays: Number
  },
  
  // Statistics
  stats: {
    totalEpisodes: Number,
    totalSubscribers: Number,
    lastUpdated: Date,
    lastEpisodeDate: Date
  },
  
  // Status
  status: String, // "active", "paused", "archived"
  
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Analytics Collection
```javascript
{
  _id: ObjectId,
  type: String, // "episode_play", "download", "share", "like", "comment"
  episodeId: ObjectId (ref: Podcast Episodes),
  userId: ObjectId (ref: Users), // optional for anonymous users
  
  // Event Details
  event: {
    timestamp: Date,
    duration: Number, // for play events
    source: String, // "rss", "web", "mobile", "social"
    userAgent: String,
    ipAddress: String,
    country: String,
    city: String
  },
  
  // Additional Data
  metadata: {
    platform: String,
    device: String,
    referrer: String,
    campaign: String
  },
  
  createdAt: Date
}
```

### 7. Content Templates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String, // "intro", "outro", "ad_break", "transition"
  
  // Template Content
  template: {
    structure: [{
      type: String,
      placeholder: String,
      required: Boolean,
      options: [String] // for dropdowns
    }],
    script: String, // template with placeholders
    variables: [String] // available variables
  },
  
  // Settings
  settings: {
    humorLevel: Number, // 1-10
    duration: Number, // estimated duration
    voiceSettings: Object
  },
  
  // Usage
  usage: {
    timesUsed: Number,
    lastUsed: Date,
    rating: Number // average user rating
  },
  
  isActive: Boolean,
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 8. System Configuration Collection
```javascript
{
  _id: ObjectId,
  key: String (unique),
  value: Mixed,
  type: String, // "string", "number", "boolean", "object", "array"
  description: String,
  category: String, // "voice", "rss", "analytics", "processing"
  
  // Validation
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    required: Boolean
  },
  
  // Environment
  environment: String, // "development", "staging", "production"
  
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

### Performance Indexes
```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "lastActive": -1 })

// User Prompts
db.userPrompts.createIndex({ "userId": 1, "createdAt": -1 })
db.userPrompts.createIndex({ "processing.status": 1, "processing.priority": -1 })
db.userPrompts.createIndex({ "category": 1, "mood": 1 })

// Podcast Episodes
db.podcastEpisodes.createIndex({ "status": 1, "publishedAt": -1 })
db.podcastEpisodes.createIndex({ "createdBy": 1, "createdAt": -1 })
db.podcastEpisodes.createIndex({ "rssFeedId": 1, "publishedAt": -1 })
db.podcastEpisodes.createIndex({ "tags": 1 })
db.podcastEpisodes.createIndex({ "category": 1, "status": 1 })

// Voice Generation Jobs
db.voiceGenerationJobs.createIndex({ "status": 1, "priority": -1 })
db.voiceGenerationJobs.createIndex({ "episodeId": 1 })
db.voiceGenerationJobs.createIndex({ "createdAt": 1 })

// RSS Feeds
db.rssFeeds.createIndex({ "url": 1 }, { unique: true })
db.rssFeeds.createIndex({ "ownerId": 1 })
db.rssFeeds.createIndex({ "status": 1 })

// Analytics
db.analytics.createIndex({ "type": 1, "createdAt": -1 })
db.analytics.createIndex({ "episodeId": 1, "createdAt": -1 })
db.analytics.createIndex({ "userId": 1, "createdAt": -1 })
db.analytics.createIndex({ "event.timestamp": -1 })
```

## Relationships

1. **Users** → **User Prompts** (1:many)
2. **Users** → **Podcast Episodes** (1:many)
3. **Users** → **RSS Feeds** (1:many)
4. **User Prompts** → **Podcast Episodes** (many:many)
5. **Podcast Episodes** → **Voice Generation Jobs** (1:many)
6. **RSS Feeds** → **Podcast Episodes** (1:many)
7. **Podcast Episodes** → **Analytics** (1:many)
8. **Users** → **Analytics** (1:many)

## Data Flow

1. **User submits prompt** → User Prompts collection
2. **AI processes prompt** → Creates Podcast Episodes
3. **Voice generation triggered** → Voice Generation Jobs collection
4. **Episode published** → RSS Feeds updated
5. **User interactions tracked** → Analytics collection
