// Sample Data for Humorous Podcast Application
// Run this script after running mongodb-setup.js

use podcastDB;

// ===========================================
// 1. CREATE INDEXES FOR PERFORMANCE
// ===========================================

// Users indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "lastActive": -1 });
db.users.createIndex({ "subscription.plan": 1 });

// User Prompts indexes
db.userPrompts.createIndex({ "userId": 1, "createdAt": -1 });
db.userPrompts.createIndex({ "processing.status": 1, "processing.priority": -1 });
db.userPrompts.createIndex({ "category": 1, "mood": 1 });
db.userPrompts.createIndex({ "createdAt": -1 });

// Podcast Episodes indexes
db.podcastEpisodes.createIndex({ "status": 1, "publishedAt": -1 });
db.podcastEpisodes.createIndex({ "createdBy": 1, "createdAt": -1 });
db.podcastEpisodes.createIndex({ "rssFeedId": 1, "publishedAt": -1 });
db.podcastEpisodes.createIndex({ "tags": 1 });
db.podcastEpisodes.createIndex({ "category": 1, "status": 1 });
db.podcastEpisodes.createIndex({ "episodeNumber": 1, "season": 1 });

// Voice Generation Jobs indexes
db.voiceGenerationJobs.createIndex({ "status": 1, "priority": -1 });
db.voiceGenerationJobs.createIndex({ "episodeId": 1 });
db.voiceGenerationJobs.createIndex({ "createdAt": 1 });

// RSS Feeds indexes
db.rssFeeds.createIndex({ "url": 1 }, { unique: true });
db.rssFeeds.createIndex({ "ownerId": 1 });
db.rssFeeds.createIndex({ "status": 1 });

// Analytics indexes
db.analytics.createIndex({ "type": 1, "createdAt": -1 });
db.analytics.createIndex({ "episodeId": 1, "createdAt": -1 });
db.analytics.createIndex({ "userId": 1, "createdAt": -1 });
db.analytics.createIndex({ "event.timestamp": -1 });
db.analytics.createIndex({ "event.source": 1 });

// Content Templates indexes
db.contentTemplates.createIndex({ "category": 1, "isActive": 1 });
db.contentTemplates.createIndex({ "createdBy": 1 });
db.contentTemplates.createIndex({ "usage.timesUsed": -1 });

// System Configuration indexes
db.systemConfig.createIndex({ "key": 1 }, { unique: true });
db.systemConfig.createIndex({ "category": 1 });
db.systemConfig.createIndex({ "environment": 1 });

print("✅ All indexes created successfully!");

// ===========================================
// 2. INSERT SAMPLE DATA
// ===========================================

// Sample Users
const users = [
  {
    _id: ObjectId(),
    username: "comedy_king",
    email: "john@example.com",
    profile: {
      displayName: "John Comedy",
      avatar: "https://example.com/avatars/john.jpg",
      preferences: {
        humorStyle: "sarcastic",
        language: "en",
        timezone: "America/New_York"
      }
    },
    subscription: {
      plan: "premium",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31")
    },
    stats: {
      totalPrompts: 25,
      totalEpisodes: 8,
      favoriteEpisodes: []
    },
    createdAt: new Date("2024-01-01"),
    lastActive: new Date()
  },
  {
    _id: ObjectId(),
    username: "funny_bones",
    email: "sarah@example.com",
    profile: {
      displayName: "Sarah Witty",
      avatar: "https://example.com/avatars/sarah.jpg",
      preferences: {
        humorStyle: "witty",
        language: "en",
        timezone: "Europe/London"
      }
    },
    subscription: {
      plan: "pro",
      startDate: new Date("2024-02-15"),
      endDate: new Date("2025-02-15")
    },
    stats: {
      totalPrompts: 42,
      totalEpisodes: 15,
      favoriteEpisodes: []
    },
    createdAt: new Date("2024-02-15"),
    lastActive: new Date()
  },
  {
    _id: ObjectId(),
    username: "absurd_thoughts",
    email: "mike@example.com",
    profile: {
      displayName: "Mike Absurd",
      avatar: "https://example.com/avatars/mike.jpg",
      preferences: {
        humorStyle: "absurd",
        language: "en",
        timezone: "America/Los_Angeles"
      }
    },
    subscription: {
      plan: "free",
      startDate: new Date("2024-03-01"),
      endDate: null
    },
    stats: {
      totalPrompts: 12,
      totalEpisodes: 3,
      favoriteEpisodes: []
    },
    createdAt: new Date("2024-03-01"),
    lastActive: new Date()
  }
];

db.users.insertMany(users);
print("✅ Sample users inserted!");

// Sample User Prompts
const userPrompts = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    prompt: "I just realized that my coffee maker has more personality than my ex. At least it wakes up every morning with a purpose!",
    category: "personal",
    mood: "sarcastic",
    context: {
      tags: ["coffee", "relationships", "morning", "sarcasm"],
      source: "web",
      originalLength: 120
    },
    processing: {
      status: "completed",
      priority: 5,
      assignedTo: "ai_processor_1"
    },
    createdAt: new Date("2024-01-15T10:30:00Z"),
    processedAt: new Date("2024-01-15T10:35:00Z")
  },
  {
    _id: ObjectId(),
    userId: users[1]._id,
    prompt: "Why do we say 'tuna fish' but not 'beef mammal'? The English language is a beautiful disaster.",
    category: "observation",
    mood: "witty",
    context: {
      tags: ["language", "food", "observation", "wordplay"],
      source: "mobile",
      originalLength: 95
    },
    processing: {
      status: "completed",
      priority: 7,
      assignedTo: "ai_processor_2"
    },
    createdAt: new Date("2024-02-20T14:15:00Z"),
    processedAt: new Date("2024-02-20T14:20:00Z")
  },
  {
    _id: ObjectId(),
    userId: users[2]._id,
    prompt: "I tried to organize a surprise party for my cat. She wasn't surprised, but she was definitely judging my party planning skills.",
    category: "personal",
    mood: "absurd",
    context: {
      tags: ["pets", "parties", "cats", "absurd"],
      source: "web",
      originalLength: 110
    },
    processing: {
      status: "processing",
      priority: 3,
      assignedTo: "ai_processor_1"
    },
    createdAt: new Date("2024-03-10T09:45:00Z"),
    processedAt: null
  }
];

db.userPrompts.insertMany(userPrompts);
print("✅ Sample user prompts inserted!");

// Sample RSS Feeds
const rssFeeds = [
  {
    _id: ObjectId(),
    name: "Comedy King's Daily Dose",
    description: "Daily doses of sarcastic humor and witty observations",
    url: "https://podcast.example.com/feeds/comedy-king.xml",
    ownerId: users[0]._id,
    config: {
      title: "Comedy King's Daily Dose",
      description: "Your daily dose of sarcastic humor and witty observations about life, relationships, and everything in between.",
      language: "en",
      category: "Comedy",
      explicit: false,
      image: "https://example.com/images/comedy-king-cover.jpg",
      author: "John Comedy",
      email: "john@example.com"
    },
    publishing: {
      autoPublish: true,
      schedule: "0 8 * * *", // Daily at 8 AM
      maxEpisodes: 100,
      retentionDays: 365
    },
    stats: {
      totalEpisodes: 8,
      totalSubscribers: 1250,
      lastUpdated: new Date(),
      lastEpisodeDate: new Date("2024-03-15")
    },
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Witty Observations",
    description: "Sharp wit and clever observations about everyday life",
    url: "https://podcast.example.com/feeds/witty-observations.xml",
    ownerId: users[1]._id,
    config: {
      title: "Witty Observations",
      description: "Sharp wit and clever observations about everyday life, language, and human behavior.",
      language: "en",
      category: "Comedy",
      explicit: false,
      image: "https://example.com/images/witty-cover.jpg",
      author: "Sarah Witty",
      email: "sarah@example.com"
    },
    publishing: {
      autoPublish: true,
      schedule: "0 12 * * 1,3,5", // Monday, Wednesday, Friday at noon
      maxEpisodes: 50,
      retentionDays: 180
    },
    stats: {
      totalEpisodes: 15,
      totalSubscribers: 2100,
      lastUpdated: new Date(),
      lastEpisodeDate: new Date("2024-03-14")
    },
    status: "active",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date()
  }
];

db.rssFeeds.insertMany(rssFeeds);
print("✅ Sample RSS feeds inserted!");

// Sample Podcast Episodes
const podcastEpisodes = [
  {
    _id: ObjectId(),
    title: "Coffee Makers vs Exes: A Sarcastic Analysis",
    description: "In this episode, we dive deep into why your coffee maker is more reliable than your ex, complete with scientific evidence and way too much caffeine.",
    episodeNumber: 1,
    season: 1,
    duration: 420, // 7 minutes
    status: "published",
    script: {
      segments: [
        {
          type: "intro",
          content: "Welcome to Comedy King's Daily Dose, where we make fun of everything and everyone, including ourselves. I'm your host, John Comedy, and today we're talking about relationships... with appliances.",
          duration: 30,
          humorLevel: 8
        },
        {
          type: "main_content",
          content: "So I had this realization the other morning while making my third cup of coffee. My coffee maker wakes up every single day with a purpose. It doesn't need therapy, it doesn't need space, and it definitely doesn't need to 'find itself' in Thailand. It just... works. Unlike my ex, who couldn't even commit to a breakfast order without having an existential crisis.",
          duration: 180,
          humorLevel: 9
        },
        {
          type: "outro",
          content: "That's it for today's dose of reality with a side of sarcasm. Remember, if your coffee maker breaks up with you, it's probably your fault. Thanks for listening, and I'll see you tomorrow with more observations that nobody asked for.",
          duration: 30,
          humorLevel: 7
        }
      ],
      totalWords: 150,
      estimatedDuration: 240
    },
    audio: {
      filePath: "/audio/episodes/coffee-makers-vs-exes.mp3",
      fileSize: 5040000, // 5MB
      format: "mp3",
      bitrate: 128,
      sampleRate: 44100,
      generatedAt: new Date("2024-01-15T11:00:00Z"),
      voiceSettings: {
        voiceId: "sarcastic_male_01",
        speed: 1.1,
        pitch: 1.0,
        emotion: "sarcastic"
      }
    },
    tags: ["coffee", "relationships", "sarcasm", "morning", "appliances"],
    category: "comedy",
    explicit: false,
    language: "en",
    sourcePrompts: [userPrompts[0]._id],
    createdBy: users[0]._id,
    publishedAt: new Date("2024-01-15T12:00:00Z"),
    rssFeedId: rssFeeds[0]._id,
    analytics: {
      downloads: 1250,
      plays: 2100,
      shares: 45,
      likes: 89,
      comments: 12
    },
    createdAt: new Date("2024-01-15T10:40:00Z"),
    updatedAt: new Date("2024-01-15T12:00:00Z")
  },
  {
    _id: ObjectId(),
    title: "The Tuna Fish Mystery: A Linguistic Investigation",
    description: "We investigate why we say 'tuna fish' but not 'beef mammal' in this witty exploration of English language absurdities.",
    episodeNumber: 1,
    season: 1,
    duration: 380, // 6.3 minutes
    status: "published",
    script: {
      segments: [
        {
          type: "intro",
          content: "Welcome to Witty Observations, where we overthink everything and make it sound smart. I'm Sarah Witty, and today we're diving into the linguistic rabbit hole of food naming conventions.",
          duration: 25,
          humorLevel: 7
        },
        {
          type: "main_content",
          content: "Why do we say 'tuna fish' but not 'beef mammal'? I mean, technically, tuna IS a fish, so saying 'tuna fish' is like saying 'fish fish'. It's redundant! But we don't say 'beef mammal' or 'chicken bird'. The English language is a beautiful disaster, and I'm here to document every glorious inconsistency.",
          duration: 200,
          humorLevel: 8
        },
        {
          type: "outro",
          content: "That's today's linguistic observation that nobody asked for but everyone needed. Remember, language is weird, and that's what makes it beautiful. Thanks for listening to Witty Observations!",
          duration: 25,
          humorLevel: 6
        }
      ],
      totalWords: 120,
      estimatedDuration: 250
    },
    audio: {
      filePath: "/audio/episodes/tuna-fish-mystery.mp3",
      fileSize: 4560000, // 4.5MB
      format: "mp3",
      bitrate: 128,
      sampleRate: 44100,
      generatedAt: new Date("2024-02-20T15:00:00Z"),
      voiceSettings: {
        voiceId: "witty_female_01",
        speed: 1.0,
        pitch: 1.1,
        emotion: "witty"
      }
    },
    tags: ["language", "food", "observation", "wordplay", "linguistics"],
    category: "comedy",
    explicit: false,
    language: "en",
    sourcePrompts: [userPrompts[1]._id],
    createdBy: users[1]._id,
    publishedAt: new Date("2024-02-20T16:00:00Z"),
    rssFeedId: rssFeeds[1]._id,
    analytics: {
      downloads: 2100,
      plays: 3200,
      shares: 78,
      likes: 156,
      comments: 23
    },
    createdAt: new Date("2024-02-20T14:25:00Z"),
    updatedAt: new Date("2024-02-20T16:00:00Z")
  }
];

db.podcastEpisodes.insertMany(podcastEpisodes);
print("✅ Sample podcast episodes inserted!");

// Sample Voice Generation Jobs
const voiceJobs = [
  {
    _id: ObjectId(),
    episodeId: podcastEpisodes[0]._id,
    status: "completed",
    priority: 5,
    voiceConfig: {
      voiceId: "sarcastic_male_01",
      provider: "elevenlabs",
      settings: {
        speed: 1.1,
        pitch: 1.0,
        emotion: "sarcastic",
        stability: 0.8,
        clarity: 0.9
      }
    },
    processing: {
      startedAt: new Date("2024-01-15T10:45:00Z"),
      completedAt: new Date("2024-01-15T10:50:00Z"),
      duration: 300, // 5 minutes
      retryCount: 0,
      errorMessage: null
    },
    output: {
      filePath: "/audio/episodes/coffee-makers-vs-exes.mp3",
      fileSize: 5040000,
      quality: "high",
      format: "mp3"
    },
    createdAt: new Date("2024-01-15T10:40:00Z")
  },
  {
    _id: ObjectId(),
    episodeId: podcastEpisodes[1]._id,
    status: "completed",
    priority: 7,
    voiceConfig: {
      voiceId: "witty_female_01",
      provider: "elevenlabs",
      settings: {
        speed: 1.0,
        pitch: 1.1,
        emotion: "witty",
        stability: 0.9,
        clarity: 0.95
      }
    },
    processing: {
      startedAt: new Date("2024-02-20T14:30:00Z"),
      completedAt: new Date("2024-02-20T14:35:00Z"),
      duration: 300,
      retryCount: 0,
      errorMessage: null
    },
    output: {
      filePath: "/audio/episodes/tuna-fish-mystery.mp3",
      fileSize: 4560000,
      quality: "high",
      format: "mp3"
    },
    createdAt: new Date("2024-02-20T14:25:00Z")
  }
];

db.voiceGenerationJobs.insertMany(voiceJobs);
print("✅ Sample voice generation jobs inserted!");

// Sample Analytics Data
const analytics = [
  {
    _id: ObjectId(),
    type: "episode_play",
    episodeId: podcastEpisodes[0]._id,
    userId: users[1]._id,
    event: {
      timestamp: new Date("2024-01-16T08:30:00Z"),
      duration: 420,
      source: "rss",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
      ipAddress: "192.168.1.100",
      country: "US",
      city: "New York"
    },
    metadata: {
      platform: "mobile",
      device: "iPhone",
      referrer: "Apple Podcasts",
      campaign: "organic"
    },
    createdAt: new Date("2024-01-16T08:30:00Z")
  },
  {
    _id: ObjectId(),
    type: "download",
    episodeId: podcastEpisodes[0]._id,
    userId: users[2]._id,
    event: {
      timestamp: new Date("2024-01-16T14:20:00Z"),
      duration: 0,
      source: "web",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.101",
      country: "US",
      city: "Los Angeles"
    },
    metadata: {
      platform: "desktop",
      device: "Windows PC",
      referrer: "Google Search",
      campaign: "organic"
    },
    createdAt: new Date("2024-01-16T14:20:00Z")
  },
  {
    _id: ObjectId(),
    type: "share",
    episodeId: podcastEpisodes[1]._id,
    userId: users[0]._id,
    event: {
      timestamp: new Date("2024-02-21T10:15:00Z"),
      duration: 0,
      source: "social",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ipAddress: "192.168.1.102",
      country: "US",
      city: "New York"
    },
    metadata: {
      platform: "desktop",
      device: "Mac",
      referrer: "Twitter",
      campaign: "social_share"
    },
    createdAt: new Date("2024-02-21T10:15:00Z")
  }
];

db.analytics.insertMany(analytics);
print("✅ Sample analytics data inserted!");

// Sample Content Templates
const contentTemplates = [
  {
    _id: ObjectId(),
    name: "Sarcastic Intro Template",
    description: "A witty, sarcastic introduction template for comedy podcasts",
    category: "intro",
    template: {
      structure: [
        {
          type: "text",
          placeholder: "Welcome to {show_name}, where we {show_description}",
          required: true,
          options: []
        },
        {
          type: "text",
          placeholder: "I'm {host_name}, and today we're talking about {topic}",
          required: true,
          options: []
        },
        {
          type: "text",
          placeholder: "Because apparently, {sarcastic_observation}",
          required: false,
          options: []
        }
      ],
      script: "Welcome to {show_name}, where we {show_description}. I'm {host_name}, and today we're talking about {topic}. Because apparently, {sarcastic_observation}.",
      variables: ["show_name", "show_description", "host_name", "topic", "sarcastic_observation"]
    },
    settings: {
      humorLevel: 8,
      duration: 30,
      voiceSettings: {
        speed: 1.1,
        pitch: 1.0,
        emotion: "sarcastic"
      }
    },
    usage: {
      timesUsed: 25,
      lastUsed: new Date("2024-03-10"),
      rating: 4.5
    },
    isActive: true,
    createdBy: users[0]._id,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-10")
  },
  {
    _id: ObjectId(),
    name: "Witty Observation Template",
    description: "Template for making witty observations about everyday life",
    category: "main_content",
    template: {
      structure: [
        {
          type: "text",
          placeholder: "I had this {random_thought} the other day",
          required: true,
          options: []
        },
        {
          type: "text",
          placeholder: "Why do we {common_behavior} but not {contrasting_behavior}?",
          required: true,
          options: []
        },
        {
          type: "text",
          placeholder: "It's like {funny_comparison}",
          required: false,
          options: []
        }
      ],
      script: "I had this {random_thought} the other day. Why do we {common_behavior} but not {contrasting_behavior}? It's like {funny_comparison}.",
      variables: ["random_thought", "common_behavior", "contrasting_behavior", "funny_comparison"]
    },
    settings: {
      humorLevel: 7,
      duration: 60,
      voiceSettings: {
        speed: 1.0,
        pitch: 1.1,
        emotion: "witty"
      }
    },
    usage: {
      timesUsed: 18,
      lastUsed: new Date("2024-03-08"),
      rating: 4.2
    },
    isActive: true,
    createdBy: users[1]._id,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-08")
  }
];

db.contentTemplates.insertMany(contentTemplates);
print("✅ Sample content templates inserted!");

// Sample System Configuration
const systemConfig = [
  {
    _id: ObjectId(),
    key: "voice_generation_provider",
    value: "elevenlabs",
    type: "string",
    description: "Default voice generation provider",
    category: "voice",
    validation: {
      required: true,
      pattern: "^(elevenlabs|azure|aws_polly|google|openai)$"
    },
    environment: "all",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    key: "max_episode_duration",
    value: 1800,
    type: "number",
    description: "Maximum episode duration in seconds (30 minutes)",
    category: "processing",
    validation: {
      required: true,
      min: 60,
      max: 3600
    },
    environment: "all",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    key: "auto_publish_enabled",
    value: true,
    type: "boolean",
    description: "Enable automatic publishing of completed episodes",
    category: "rss",
    validation: {
      required: true
    },
    environment: "production",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    key: "default_humor_level",
    value: 7,
    type: "number",
    description: "Default humor level for generated content (1-10)",
    category: "ai",
    validation: {
      required: true,
      min: 1,
      max: 10
    },
    environment: "all",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

db.systemConfig.insertMany(systemConfig);
print("✅ Sample system configuration inserted!");

// Update user favorite episodes
db.users.updateOne(
  { _id: users[0]._id },
  { $set: { "stats.favoriteEpisodes": [podcastEpisodes[0]._id] } }
);

db.users.updateOne(
  { _id: users[1]._id },
  { $set: { "stats.favoriteEpisodes": [podcastEpisodes[1]._id] } }
);

print("✅ User favorite episodes updated!");

print("\n🎉 Sample data insertion completed successfully!");
print("📊 Database Summary:");
print(`   - Users: ${db.users.countDocuments()}`);
print(`   - User Prompts: ${db.userPrompts.countDocuments()}`);
print(`   - Podcast Episodes: ${db.podcastEpisodes.countDocuments()}`);
print(`   - RSS Feeds: ${db.rssFeeds.countDocuments()}`);
print(`   - Voice Jobs: ${db.voiceGenerationJobs.countDocuments()}`);
print(`   - Analytics Events: ${db.analytics.countDocuments()}`);
print(`   - Content Templates: ${db.contentTemplates.countDocuments()}`);
print(`   - System Config: ${db.systemConfig.countDocuments()}`);
