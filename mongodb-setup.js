// MongoDB Setup Script for Humorous Podcast Application
// Run this script in MongoDB Compass or MongoDB Shell

// ===========================================
// 1. CREATE COLLECTIONS WITH VALIDATION
// ===========================================

// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "profile", "subscription", "createdAt"],
      properties: {
        username: { bsonType: "string", minLength: 3, maxLength: 50 },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        profile: {
          bsonType: "object",
          required: ["displayName"],
          properties: {
            displayName: { bsonType: "string", minLength: 1, maxLength: 100 },
            avatar: { bsonType: "string" },
            preferences: {
              bsonType: "object",
               properties: {
                 humorStyle: { 
                   bsonType: "string", 
                   enum: ["sarcastic", "witty", "absurd", "observational", "dark", "wholesome"] 
                 },
                 language: { bsonType: "string" },
                 timezone: { bsonType: "string" },
                 voicePreference: { 
                   bsonType: "string", 
                   enum: ["calm", "energetic"] 
                 }
               }
            }
          }
        },
        subscription: {
          bsonType: "object",
          required: ["plan"],
          properties: {
            plan: { bsonType: "string", enum: ["free", "premium", "pro"] },
            startDate: { bsonType: "date" },
            endDate: { bsonType: "date" }
          }
        },
        stats: {
          bsonType: "object",
          properties: {
            totalPrompts: { bsonType: "int", minimum: 0 },
            totalEpisodes: { bsonType: "int", minimum: 0 },
            favoriteEpisodes: { bsonType: "array", items: { bsonType: "objectId" } }
          }
        },
        createdAt: { bsonType: "date" },
        lastActive: { bsonType: "date" }
      }
    }
  }
});

// User Prompts Collection
db.createCollection("userPrompts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "prompt", "category", "mood", "processing", "createdAt"],
      properties: {
        userId: { bsonType: "objectId" },
        prompt: { bsonType: "string", minLength: 10, maxLength: 2000 },
        category: { 
          bsonType: "string", 
          enum: ["news", "personal", "random", "trending", "comedy", "story", "observation"] 
        },
        mood: { 
          bsonType: "string", 
          enum: ["funny", "sarcastic", "wholesome", "dark", "witty", "absurd", "observational"] 
        },
        context: {
          bsonType: "object",
          properties: {
            tags: { bsonType: "array", items: { bsonType: "string" } },
            source: { bsonType: "string", enum: ["web", "mobile", "api", "import"] },
            originalLength: { bsonType: "int", minimum: 0 }
          }
        },
        processing: {
          bsonType: "object",
          required: ["status", "priority"],
          properties: {
            status: { 
              bsonType: "string", 
              enum: ["pending", "processing", "completed", "failed", "cancelled"] 
            },
            priority: { bsonType: "int", minimum: 1, maximum: 10 },
            assignedTo: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" },
        processedAt: { bsonType: "date" }
      }
    }
  }
});

// Podcast Episodes Collection
db.createCollection("podcastEpisodes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "episodeNumber", "status", "script", "createdBy", "createdAt"],
      properties: {
        title: { bsonType: "string", minLength: 5, maxLength: 200 },
        description: { bsonType: "string", maxLength: 1000 },
        episodeNumber: { bsonType: "int", minimum: 1 },
         season: { bsonType: "int", minimum: 1 },
        duration: { bsonType: "int", minimum: 0 },
        status: { 
          bsonType: "string", 
          enum: ["draft", "processing", "ready", "published", "archived"] 
        },
        script: {
          bsonType: "object",
          required: ["segments"],
          properties: {
            segments: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["type", "content", "duration"],
                properties: {
                  type: { 
                    bsonType: "string", 
                    enum: ["intro", "main_content", "outro", "ad_break", "transition", "joke", "story"] 
                  },
                  content: { bsonType: "string" },
                  duration: { bsonType: "int", minimum: 0 },
                  humorLevel: { bsonType: "int", minimum: 1, maximum: 10 }
                }
              }
            },
            totalWords: { bsonType: "int", minimum: 0 },
            estimatedDuration: { bsonType: "int", minimum: 0 }
          }
        },
        audio: {
          bsonType: "object",
          properties: {
            filePath: { bsonType: "string" },
            fileSize: { bsonType: "int", minimum: 0 },
            format: { bsonType: "string", enum: ["mp3", "wav", "aac", "ogg"] },
            bitrate: { bsonType: "int", minimum: 0 },
            sampleRate: { bsonType: "int", minimum: 0 },
            generatedAt: { bsonType: "date" },
            voiceSettings: {
              bsonType: "object",
              properties: {
                voiceId: { bsonType: "string" },
                speed: { bsonType: "double", minimum: 0.5, maximum: 2.0 },
                pitch: { bsonType: "double", minimum: 0.5, maximum: 2.0 },
                emotion: { 
                  bsonType: "string", 
                  enum: ["neutral", "happy", "sad", "excited", "calm", "dramatic", "sarcastic"] 
                }
              }
            }
          }
        },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        category: { bsonType: "string" },
         explicit: { bsonType: "bool" },
         language: { bsonType: "string" },
        sourcePrompts: { bsonType: "array", items: { bsonType: "objectId" } },
        createdBy: { bsonType: "objectId" },
        publishedAt: { bsonType: "date" },
        rssFeedId: { bsonType: "objectId" },
        analytics: {
          bsonType: "object",
          properties: {
            downloads: { bsonType: "int", minimum: 0 },
            plays: { bsonType: "int", minimum: 0 },
            shares: { bsonType: "int", minimum: 0 },
            likes: { bsonType: "int", minimum: 0 },
            comments: { bsonType: "int", minimum: 0 }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Voice Generation Jobs Collection
db.createCollection("voiceGenerationJobs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["episodeId", "status", "priority", "voiceConfig", "createdAt"],
      properties: {
        episodeId: { bsonType: "objectId" },
        status: { 
          bsonType: "string", 
          enum: ["queued", "processing", "completed", "failed", "cancelled"] 
        },
        priority: { bsonType: "int", minimum: 1, maximum: 10 },
        voiceConfig: {
          bsonType: "object",
          required: ["voiceId", "provider"],
          properties: {
            voiceId: { bsonType: "string" },
            provider: { 
              bsonType: "string", 
              enum: ["elevenlabs", "azure", "aws_polly", "google", "openai"] 
            },
            settings: {
              bsonType: "object",
              properties: {
                speed: { bsonType: "double", minimum: 0.5, maximum: 2.0 },
                pitch: { bsonType: "double", minimum: 0.5, maximum: 2.0 },
                emotion: { bsonType: "string" },
                stability: { bsonType: "double", minimum: 0, maximum: 1 },
                clarity: { bsonType: "double", minimum: 0, maximum: 1 }
              }
            }
          }
        },
        processing: {
          bsonType: "object",
          properties: {
            startedAt: { bsonType: "date" },
            completedAt: { bsonType: "date" },
            duration: { bsonType: "int", minimum: 0 },
            retryCount: { bsonType: "int", minimum: 0 },
            errorMessage: { bsonType: "string" }
          }
        },
        output: {
          bsonType: "object",
          properties: {
            filePath: { bsonType: "string" },
            fileSize: { bsonType: "int", minimum: 0 },
            quality: { bsonType: "string", enum: ["standard", "high", "premium"] },
            format: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// RSS Feeds Collection
db.createCollection("rssFeeds", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "url", "ownerId", "config", "status", "createdAt"],
      properties: {
        name: { bsonType: "string", minLength: 1, maxLength: 100 },
        description: { bsonType: "string", maxLength: 500 },
        url: { bsonType: "string", pattern: "^https?://" },
        ownerId: { bsonType: "objectId" },
        config: {
          bsonType: "object",
          required: ["title", "description", "language"],
          properties: {
            title: { bsonType: "string", minLength: 1, maxLength: 200 },
            description: { bsonType: "string", maxLength: 1000 },
            language: { bsonType: "string", minLength: 2, maxLength: 5 },
            category: { bsonType: "string" },
            explicit: { bsonType: "bool" },
            image: { bsonType: "string" },
            author: { bsonType: "string" },
            email: { bsonType: "string" }
          }
        },
        publishing: {
          bsonType: "object",
          properties: {
             autoPublish: { bsonType: "bool" },
            schedule: { bsonType: "string" },
            maxEpisodes: { bsonType: "int", minimum: 1 },
            retentionDays: { bsonType: "int", minimum: 1 }
          }
        },
        stats: {
          bsonType: "object",
          properties: {
            totalEpisodes: { bsonType: "int", minimum: 0 },
            totalSubscribers: { bsonType: "int", minimum: 0 },
            lastUpdated: { bsonType: "date" },
            lastEpisodeDate: { bsonType: "date" }
          }
        },
        status: { 
          bsonType: "string", 
          enum: ["active", "paused", "archived"] 
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Analytics Collection
db.createCollection("analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "episodeId", "event", "createdAt"],
      properties: {
        type: { 
          bsonType: "string", 
          enum: ["episode_play", "download", "share", "like", "comment", "subscribe", "unsubscribe"] 
        },
        episodeId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        event: {
          bsonType: "object",
          required: ["timestamp"],
          properties: {
            timestamp: { bsonType: "date" },
            duration: { bsonType: "int", minimum: 0 },
            source: { bsonType: "string" },
            userAgent: { bsonType: "string" },
            ipAddress: { bsonType: "string" },
            country: { bsonType: "string" },
            city: { bsonType: "string" }
          }
        },
        metadata: {
          bsonType: "object",
          properties: {
            platform: { bsonType: "string" },
            device: { bsonType: "string" },
            referrer: { bsonType: "string" },
            campaign: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Content Templates Collection
db.createCollection("contentTemplates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "category", "template", "isActive", "createdBy", "createdAt"],
      properties: {
        name: { bsonType: "string", minLength: 1, maxLength: 100 },
        description: { bsonType: "string", maxLength: 500 },
        category: { 
          bsonType: "string", 
          enum: ["intro", "outro", "ad_break", "transition", "joke", "story", "news", "personal"] 
        },
        template: {
          bsonType: "object",
          required: ["structure", "script"],
          properties: {
            structure: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["type", "placeholder"],
                properties: {
                  type: { bsonType: "string" },
                  placeholder: { bsonType: "string" },
                  required: { bsonType: "bool" },
                  options: { bsonType: "array", items: { bsonType: "string" } }
                }
              }
            },
            script: { bsonType: "string" },
            variables: { bsonType: "array", items: { bsonType: "string" } }
          }
        },
        settings: {
          bsonType: "object",
          properties: {
            humorLevel: { bsonType: "int", minimum: 1, maximum: 10 },
            duration: { bsonType: "int", minimum: 0 },
            voiceSettings: { bsonType: "object" }
          }
        },
        usage: {
          bsonType: "object",
          properties: {
            timesUsed: { bsonType: "int", minimum: 0 },
            lastUsed: { bsonType: "date" },
            rating: { bsonType: "double", minimum: 0, maximum: 5 }
          }
        },
        isActive: { bsonType: "bool" },
        createdBy: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// System Configuration Collection
db.createCollection("systemConfig", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["key", "value", "type", "description", "category", "createdAt"],
      properties: {
        key: { bsonType: "string", minLength: 1, maxLength: 100 },
        value: { bsonType: ["string", "int", "double", "bool", "object", "array"] },
        type: { 
          bsonType: "string", 
          enum: ["string", "number", "boolean", "object", "array"] 
        },
        description: { bsonType: "string", maxLength: 500 },
        category: { 
          bsonType: "string", 
          enum: ["voice", "rss", "analytics", "processing", "ai", "general"] 
        },
        validation: {
          bsonType: "object",
          properties: {
            min: { bsonType: "number" },
            max: { bsonType: "number" },
            pattern: { bsonType: "string" },
            required: { bsonType: "bool" }
          }
        },
        environment: { 
          bsonType: "string", 
          enum: ["development", "staging", "production", "all"] 
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

print("✅ All collections created successfully with validation rules!");
