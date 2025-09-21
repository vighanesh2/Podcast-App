import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  // Mock data for saved podcasts
  const savedPodcasts = [
    {
      id: '1',
      title: 'List of Ikea product names',
      duration: '45 min',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      description: 'A comprehensive list of IKEA furniture names',
      savedDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Paint Drying Storytelling',
      duration: '15 min',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      description: 'The fascinating story of paint drying',
      savedDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Your Time',
      duration: '60 min',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      description: 'Reflections on time and existence',
      savedDate: '3 days ago'
    },
    {
      id: '4',
      title: 'Paper Clips Collection',
      duration: '30 min',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
      description: 'A detailed exploration of paper clip varieties',
      savedDate: '5 days ago'
    },
    {
      id: '5',
      title: 'Abstract Shapes Meditation',
      duration: '25 min',
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop',
      description: 'Visual meditation through abstract patterns',
      savedDate: '1 day ago'
    }
  ];

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity style={styles.podcastItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.podcastThumbnail} />
      <View style={styles.podcastContent}>
        <Text style={styles.podcastTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.podcastDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.podcastMeta}>
          <Text style={styles.podcastDuration}>{item.duration}</Text>
          <Text style={styles.podcastSavedDate}>• {item.savedDate}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Text style={styles.playButtonText}>▶</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Podcasts</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={savedPodcasts}
          renderItem={renderPodcastItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.podcastList}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation?.navigate('main')}
        >
          <Image 
            source={require('../assets/headphones-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#666' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation?.navigate('explore')}
        >
          <Image 
            source={require('../assets/compass-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#666' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/heart-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#4C0099' }]}
            resizeMode="contain"
          />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation?.navigate('profile')}
        >
          <Image 
            source={require('../assets/Group 152.png')} 
            style={[styles.navIconImage, { tintColor: '#666' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c2c2c',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  podcastList: {
    paddingBottom: 100,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  podcastThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  podcastContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  podcastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 4,
  },
  podcastDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  podcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podcastDuration: {
    fontSize: 12,
    color: '#4C0099',
    fontWeight: '600',
  },
  podcastSavedDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4C0099',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4C0099',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    // Advanced glass effect with modern purple and white mix
    backgroundColor: 'rgba(139, 69, 255, 0.12)',
    // Glass filter simulation with multiple layers
    shadowColor: '#8B45FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 15,
    // Glass borders with modern purple and white highlight
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 255, 0.25)',
    // Specular highlight effect with white
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
    // Glass overlay effect with mixed colors
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    // Glass distortion simulation
    transform: [{ perspective: 1000 }],
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  navIconImage: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4C0099',
  },
});

export default FavoritesScreen;
