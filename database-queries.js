// Common Database Queries for Humorous Podcast Application
// These are example queries you can use in MongoDB Compass or your application

use podcastDB;

// ===========================================
// 1. USER MANAGEMENT QUERIES
// ===========================================

// Get all users with their subscription details
db.users.aggregate([
  {
    $lookup: {
      from: "userPrompts",
      localField: "_id",
      foreignField: "userId",
      as: "prompts"
    }
  },
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "createdBy",
      as: "episodes"
    }
  },
  {
    $project: {
      username: 1,
      email: 1,
      "profile.displayName": 1,
      "subscription.plan": 1,
      "stats.totalPrompts": 1,
      "stats.totalEpisodes": 1,
      promptCount: { $size: "$prompts" },
      episodeCount: { $size: "$episodes" },
      lastActive: 1
    }
  }
]);

// Get users by humor style preference
db.users.find(
  { "profile.preferences.humorStyle": "sarcastic" },
  { username: 1, "profile.displayName": 1, "profile.preferences.humorStyle": 1 }
);

// Get premium users with their episode count
db.users.aggregate([
  { $match: { "subscription.plan": { $in: ["premium", "pro"] } } },
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "createdBy",
      as: "episodes"
    }
  },
  {
    $project: {
      username: 1,
      "subscription.plan": 1,
      episodeCount: { $size: "$episodes" },
      lastActive: 1
    }
  },
  { $sort: { episodeCount: -1 } }
]);

// ===========================================
// 2. CONTENT CREATION QUERIES
// ===========================================

// Get all pending prompts ordered by priority
db.userPrompts.find(
  { "processing.status": "pending" },
  { prompt: 1, category: 1, mood: 1, "processing.priority": 1, createdAt: 1 }
).sort({ "processing.priority": -1, createdAt: 1 });

// Get prompts by category and mood
db.userPrompts.find(
  { 
    category: "personal",
    mood: { $in: ["sarcastic", "witty"] }
  },
  { prompt: 1, category: 1, mood: 1, createdAt: 1 }
).sort({ createdAt: -1 });

// Get prompts that led to published episodes
db.userPrompts.aggregate([
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "sourcePrompts",
      as: "episodes"
    }
  },
  {
    $match: {
      "episodes.status": "published"
    }
  },
  {
    $project: {
      prompt: 1,
      category: 1,
      mood: 1,
      episodeCount: { $size: "$episodes" },
      episodeTitles: "$episodes.title"
    }
  }
]);

// ===========================================
// 3. PODCAST EPISODE QUERIES
// ===========================================

// Get all published episodes with analytics
db.podcastEpisodes.aggregate([
  { $match: { status: "published" } },
  {
    $lookup: {
      from: "users",
      localField: "createdBy",
      foreignField: "_id",
      as: "creator"
    }
  },
  {
    $project: {
      title: 1,
      description: 1,
      episodeNumber: 1,
      duration: 1,
      publishedAt: 1,
      "analytics.downloads": 1,
      "analytics.plays": 1,
      "analytics.likes": 1,
      creator: { $arrayElemAt: ["$creator.username", 0] },
      tags: 1
    }
  },
  { $sort: { publishedAt: -1 } }
]);

// Get episodes by humor level
db.podcastEpisodes.find(
  { 
    "script.segments.humorLevel": { $gte: 8 },
    status: "published"
  },
  { title: 1, "script.segments.humorLevel": 1, tags: 1 }
);

// Get episodes with highest engagement
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
  {
    $project: {
      title: 1,
      "analytics.downloads": 1,
      "analytics.plays": 1,
      "analytics.shares": 1,
      "analytics.likes": 1,
      totalEngagement: 1,
      publishedAt: 1
    }
  },
  { $sort: { totalEngagement: -1 } },
  { $limit: 10 }
]);

// Get episodes by tag
db.podcastEpisodes.find(
  { 
    tags: { $in: ["coffee", "relationships"] },
    status: "published"
  },
  { title: 1, tags: 1, publishedAt: 1 }
).sort({ publishedAt: -1 });

// ===========================================
// 4. VOICE GENERATION QUERIES
// ===========================================

// Get all voice generation jobs by status
db.voiceGenerationJobs.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      avgDuration: { $avg: "$processing.duration" }
    }
  },
  { $sort: { count: -1 } }
]);

// Get failed voice generation jobs
db.voiceGenerationJobs.find(
  { status: "failed" },
  { 
    episodeId: 1, 
    "processing.errorMessage": 1, 
    "processing.retryCount": 1,
    createdAt: 1
  }
).sort({ createdAt: -1 });

// Get voice generation performance by provider
db.voiceGenerationJobs.aggregate([
  {
    $group: {
      _id: "$voiceConfig.provider",
      totalJobs: { $sum: 1 },
      completedJobs: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      },
      avgDuration: { $avg: "$processing.duration" },
      successRate: {
        $avg: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      provider: "$_id",
      totalJobs: 1,
      completedJobs: 1,
      avgDuration: { $round: ["$avgDuration", 2] },
      successRate: { $round: [{ $multiply: ["$successRate", 100] }, 2] }
    }
  },
  { $sort: { successRate: -1 } }
]);

// ===========================================
// 5. RSS FEED QUERIES
// ===========================================

// Get all active RSS feeds with episode counts
db.rssFeeds.aggregate([
  { $match: { status: "active" } },
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "rssFeedId",
      as: "episodes"
    }
  },
  {
    $project: {
      name: 1,
      url: 1,
      "config.title": 1,
      "stats.totalSubscribers": 1,
      episodeCount: { $size: "$episodes" },
      lastEpisodeDate: { $max: "$episodes.publishedAt" }
    }
  },
  { $sort: { "stats.totalSubscribers": -1 } }
]);

// Get RSS feeds that need updating
db.rssFeeds.find(
  {
    status: "active",
    $or: [
      { "stats.lastUpdated": { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      { "stats.lastUpdated": { $exists: false } }
    ]
  },
  { name: 1, url: 1, "stats.lastUpdated": 1 }
);

// ===========================================
// 6. ANALYTICS QUERIES
// ===========================================

// Get analytics summary for an episode
db.analytics.aggregate([
  { $match: { episodeId: ObjectId("EPISODE_ID_HERE") } },
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 },
      totalDuration: { $sum: "$event.duration" },
      avgDuration: { $avg: "$event.duration" }
    }
  },
  { $sort: { count: -1 } }
]);

// Get user engagement over time
db.analytics.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$event.timestamp" },
        month: { $month: "$event.timestamp" },
        day: { $dayOfMonth: "$event.timestamp" }
      },
      totalEvents: { $sum: 1 },
      uniqueUsers: { $addToSet: "$userId" }
    }
  },
  {
    $project: {
      date: {
        $dateFromParts: {
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day"
        }
      },
      totalEvents: 1,
      uniqueUserCount: { $size: "$uniqueUsers" }
    }
  },
  { $sort: { date: -1 } },
  { $limit: 30 }
]);

// Get top performing episodes by downloads
db.analytics.aggregate([
  { $match: { type: "download" } },
  {
    $group: {
      _id: "$episodeId",
      downloadCount: { $sum: 1 },
      uniqueUsers: { $addToSet: "$userId" }
    }
  },
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "_id",
      as: "episode"
    }
  },
  {
    $project: {
      episodeTitle: { $arrayElemAt: ["$episode.title", 0] },
      downloadCount: 1,
      uniqueUserCount: { $size: "$uniqueUsers" }
    }
  },
  { $sort: { downloadCount: -1 } },
  { $limit: 10 }
]);

// Get analytics by source/platform
db.analytics.aggregate([
  {
    $group: {
      _id: {
        source: "$event.source",
        platform: "$metadata.platform"
      },
      eventCount: { $sum: 1 },
      uniqueUsers: { $addToSet: "$userId" }
    }
  },
  {
    $project: {
      source: "$_id.source",
      platform: "$_id.platform",
      eventCount: 1,
      uniqueUserCount: { $size: "$uniqueUsers" }
    }
  },
  { $sort: { eventCount: -1 } }
]);

// ===========================================
// 7. CONTENT TEMPLATE QUERIES
// ===========================================

// Get most used templates
db.contentTemplates.aggregate([
  { $match: { isActive: true } },
  {
    $project: {
      name: 1,
      category: 1,
      "usage.timesUsed": 1,
      "usage.rating": 1,
      "settings.humorLevel": 1
    }
  },
  { $sort: { "usage.timesUsed": -1 } }
]);

// Get templates by category and humor level
db.contentTemplates.find(
  {
    category: "intro",
    "settings.humorLevel": { $gte: 7 },
    isActive: true
  },
  { name: 1, description: 1, "settings.humorLevel": 1, "usage.rating": 1 }
);

// ===========================================
// 8. SYSTEM CONFIGURATION QUERIES
// ===========================================

// Get all configuration by category
db.systemConfig.find(
  { category: "voice" },
  { key: 1, value: 1, description: 1 }
);

// Get configuration for current environment
db.systemConfig.find(
  { 
    $or: [
      { environment: "all" },
      { environment: "production" }
    ]
  },
  { key: 1, value: 1, type: 1, category: 1 }
);

// ===========================================
// 9. COMPLEX ANALYTICS QUERIES
// ===========================================

// Get user journey from prompt to episode
db.userPrompts.aggregate([
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "sourcePrompts",
      as: "episodes"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $project: {
      prompt: 1,
      category: 1,
      mood: 1,
      episodeCount: { $size: "$episodes" },
      episodeTitles: "$episodes.title",
      username: { $arrayElemAt: ["$user.username", 0] },
      createdAt: 1
    }
  },
  { $match: { episodeCount: { $gt: 0 } } },
  { $sort: { createdAt: -1 } }
]);

// Get content performance by humor style
db.users.aggregate([
  {
    $lookup: {
      from: "podcastEpisodes",
      localField: "_id",
      foreignField: "createdBy",
      as: "episodes"
    }
  },
  {
    $unwind: "$episodes"
  },
  {
    $group: {
      _id: "$profile.preferences.humorStyle",
      avgDownloads: { $avg: "$episodes.analytics.downloads" },
      avgPlays: { $avg: "$episodes.analytics.plays" },
      avgLikes: { $avg: "$episodes.analytics.likes" },
      episodeCount: { $sum: 1 }
    }
  },
  {
    $project: {
      humorStyle: "$_id",
      avgDownloads: { $round: ["$avgDownloads", 2] },
      avgPlays: { $round: ["$avgPlays", 2] },
      avgLikes: { $round: ["$avgLikes", 2] },
      episodeCount: 1
    }
  },
  { $sort: { avgDownloads: -1 } }
]);

print("✅ All example queries are ready to use!");
print("💡 Replace 'EPISODE_ID_HERE' with actual ObjectId when testing specific queries");
