import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ user, onSignOut, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllNapCasts, setShowAllNapCasts] = useState(false);

  // Mock data for podcasts
  const mostViewedData = [
    {
      id: '1',
      title: 'Paper Clips Collection',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
      duration: '30 min',
      category: 'Boring Objects'
    },
    {
      id: '2',
      title: 'Abstract Shapes',
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop',
      duration: '25 min',
      category: 'Visual Meditation'
    },
    {
      id: '3',
      title: 'Color Patterns',
      thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop',
      duration: '20 min',
      category: 'Patterns'
    }
  ];

  const snoozeCastsData = [
    {
      id: '1',
      title: 'List of Ikea product names',
      duration: '45 min',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      description: 'A comprehensive list of IKEA furniture names'
    },
    {
      id: '2',
      title: 'Paint Drying Storytelling',
      duration: '15 min',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      description: 'The fascinating story of paint drying'
    },
    {
      id: '3',
      title: 'Your Time',
      duration: '60 min',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      description: 'Reflections on time and existence'
    },
    {
      id: '4',
      title: 'Counting Sheep Variations',
      duration: '30 min',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-14b1e61d0c53?w=300&h=300&fit=crop',
      description: 'Different methods of counting sheep for better sleep'
    },
    {
      id: '5',
      title: 'White Noise Patterns',
      duration: '90 min',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3ad161dd2be?w=300&h=300&fit=crop',
      description: 'Various white noise patterns for deep sleep'
    },
    {
      id: '6',
      title: 'Boring Meeting Minutes',
      duration: '25 min',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop',
      description: 'Reading corporate meeting minutes in monotone'
    },
    {
      id: '7',
      title: 'Weather Forecast Archive',
      duration: '40 min',
      thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=300&fit=crop',
      description: 'Historical weather data from the past decade'
    },
    {
      id: '8',
      title: 'Phone Book Directory',
      duration: '75 min',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop',
      description: 'Reading through a phone directory alphabetically'
    },
    {
      id: '9',
      title: 'Tax Code Reading',
      duration: '120 min',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      description: 'Monotone reading of tax regulations'
    },
    {
      id: '10',
      title: 'Dictionary Definitions',
      duration: '50 min',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      description: 'Reading dictionary definitions from A to Z'
    }
  ];

  const renderMostViewedItem = ({ item }) => (
    <TouchableOpacity style={styles.mostViewedItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.mostViewedThumbnail} />
      <Text style={styles.mostViewedTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.mostViewedDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  const renderNapCastItem = ({ item }) => (
    <TouchableOpacity style={styles.snoozeCastItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.snoozeCastThumbnail} />
      <View style={styles.snoozeCastContent}>
        <Text style={styles.snoozeCastTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.snoozeCastDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Text style={styles.playButtonText}>▶</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Determine which NapCasts to show based on showAllNapCasts state
  const displayedNapCasts = showAllNapCasts ? snoozeCastsData : snoozeCastsData.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.topPadding} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hi {user?.name || user?.username || 'there'}!</Text>
            <View style={styles.moonContainer}>
              <Image 
                source={require('../assets/sleeping.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.zLetters}>
                <Text style={styles.zText}>Z</Text>
                <Text style={[styles.zText, styles.zText2]}>Z</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Image 
              source={require('../assets/Frame (2).png')} 
              style={styles.notificationIcon}
              resizeMode="contain"
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image 
              source={require('../assets/search-interface-symbol.png')} 
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Finding is harder go to sleep..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Main Content Container */}
        <View style={styles.content}>
          {/* Most Viewed Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Yours Most Viewed</Text>
            </View>
          <FlatList
            data={mostViewedData}
            renderItem={renderMostViewedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mostViewedList}
          />
        </View>

        {/* Created SnoozeCasts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Created NapCasts</Text>
            <TouchableOpacity onPress={() => setShowAllNapCasts(!showAllNapCasts)}>
              <Text style={styles.seeMoreText}>
                {showAllNapCasts ? 'Show less' : 'See more'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.snoozeCastsList}>
            {displayedNapCasts.map((item) => (
              <View key={item.id}>
                {renderNapCastItem({ item })}
              </View>
            ))}
          </View>
        </View>
        </View>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/headphones-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#4C0099' }]}
            resizeMode="contain"
          />
          <View style={styles.activeIndicator} />
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
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation?.navigate('favorites')}
        >
          <Image 
            source={require('../assets/heart-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#666' }]}
            resizeMode="contain"
          />
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
  topPadding: {
    height: Platform.OS === 'android' ? 24 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Amaranth-Regular' : 'Amaranth',
    fontStyle: 'normal',
  },
  moonContainer: {
    position: 'relative',
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  zLetters: {
    position: 'absolute',
    top: -8,
    left: -3,
  },
  zText: {
    fontSize: 10,
    color: '#ffb347',
    fontWeight: 'bold',
    position: 'absolute',
  },
  zText2: {
    left: 8,
    top: 3,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMoreText: {
    fontSize: 16,
    color: '#6b46c1',
    fontWeight: '600',
  },
  mostViewedList: {
    paddingLeft: 20,
  },
  mostViewedItem: {
    width: 150,
    marginRight: 15,
  },
  mostViewedThumbnail: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  mostViewedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  mostViewedDuration: {
    fontSize: 12,
    color: '#666',
  },
  snoozeCastsList: {
    paddingHorizontal: 20,
  },
  snoozeCastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  snoozeCastThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  snoozeCastContent: {
    flex: 1,
    marginLeft: 15,
  },
  snoozeCastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  snoozeCastDuration: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6b46c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 120,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    // Professional Android-style design
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    // Clean border
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  navIconImage: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#4C0099',
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

export default HomeScreen;
