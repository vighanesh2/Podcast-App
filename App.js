import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  SafeAreaView
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const podcasts = [
    {
      id: 1,
      title: "The Daily Tech",
      host: "Sarah Johnson",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop&crop=center",
      category: "Technology"
    },
    {
      id: 2,
      title: "Mindful Living",
      host: "Dr. Michael Chen",
      duration: "32 min",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center",
      category: "Wellness"
    },
    {
      id: 3,
      title: "Business Insights",
      host: "Emma Rodriguez",
      duration: "28 min",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=300&fit=crop&crop=center",
      category: "Business"
    },
    {
      id: 4,
      title: "Creative Stories",
      host: "Alex Thompson",
      duration: "38 min",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center",
      category: "Arts"
    }
  ];

  const togglePlayPause = (podcast) => {
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Podcast App</Text>
        <Text style={styles.headerSubtitle}>Discover amazing stories</Text>
      </View>

      {/* Now Playing Section */}
      {currentPodcast && (
        <View style={styles.nowPlaying}>
          <View style={styles.nowPlayingContent}>
            <Image 
              source={{ uri: currentPodcast.image }} 
              style={styles.nowPlayingImage}
            />
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingTitle}>{currentPodcast.title}</Text>
              <Text style={styles.nowPlayingHost}>{currentPodcast.host}</Text>
            </View>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Featured Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Podcasts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {podcasts.map((podcast) => (
            <TouchableOpacity 
              key={podcast.id} 
              style={styles.podcastCard}
              onPress={() => togglePlayPause(podcast)}
            >
              <Image source={{ uri: podcast.image }} style={styles.podcastImage} />
              <View style={styles.podcastInfo}>
                <Text style={styles.podcastTitle}>{podcast.title}</Text>
                <Text style={styles.podcastHost}>{podcast.host}</Text>
                <Text style={styles.podcastDuration}>{podcast.duration}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{podcast.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {['Technology', 'Wellness', 'Business', 'Arts', 'Science', 'Comedy'].map((category) => (
            <TouchableOpacity key={category} style={styles.categoryCard}>
              <Text style={styles.categoryCardText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888888',
  },
  nowPlaying: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowPlayingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  nowPlayingHost: {
    fontSize: 14,
    color: '#888888',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  podcastCard: {
    width: width * 0.6,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginLeft: 20,
    overflow: 'hidden',
  },
  podcastImage: {
    width: '100%',
    height: 120,
  },
  podcastInfo: {
    padding: 16,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  podcastHost: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  podcastDuration: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  categoryCardText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
