import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { authService } from '../services/authService';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    minutesListened: 0,
    podcastsCreated: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        // Use real stats from database
        setStats({
          minutesListened: response.user.minutesListened || 0,
          podcastsCreated: response.user.podcastsCreated || 0
        });
      } else {
        console.error('Failed to fetch user data:', response.message);
        // Fallback to local storage if API fails
        const authData = await authService.isAuthenticated();
        if (authData.isAuthenticated && authData.user) {
          setUser(authData.user);
          setStats({
            minutesListened: authData.user.minutesListened || 0,
            podcastsCreated: authData.user.podcastsCreated || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to local storage if API fails
      try {
        const authData = await authService.isAuthenticated();
        if (authData.isAuthenticated && authData.user) {
          setUser(authData.user);
          setStats({
            minutesListened: authData.user.minutesListened || 0,
            podcastsCreated: authData.user.podcastsCreated || 0
          });
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await authService.signout();
      if (result.success) {
        // Navigate back to sign in screen
        navigation?.navigate('signin');
      } else {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
    } catch (error) {
      console.error('Signout error:', error);
      Alert.alert('Error', 'Something went wrong during sign out.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B45FF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Sno</Text>
          <Image 
            source={require('../assets/sleeping.png')} 
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Cast</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.signoutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signoutText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Image 
              source={require('../assets/settings.png')} 
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }} 
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user?.name || user?.firstName || 'User'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.minutesListened}</Text>
              <Text style={styles.statLabel}>Mins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.podcastsCreated}</Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
          </View>
        </View>
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
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/Group 152.png')} 
            style={[styles.navIconImage, { tintColor: '#4C0099' }]}
            resizeMode="contain"
          />
          <View style={styles.activeIndicator} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
    fontFamily: Platform.OS === 'ios' ? 'Amaranth-Regular' : 'Amaranth',
  },
  logoIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff4444',
    borderRadius: 20,
  },
  signoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  profileSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100, // Add space for bottom navigation
    zIndex: 1,
  },
  profileCard: {
    backgroundColor: '#4C0099',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#4C0099',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginTop: -20,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#fff',
    opacity: 0.3,
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
    // Ensure navigation is above other elements
    zIndex: 10,
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

export default ProfileScreen;
