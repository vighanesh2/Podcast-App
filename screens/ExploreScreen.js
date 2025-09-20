import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ExploreScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header */}
      <View style={styles.header}>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Create SnoozeCasts</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Sleep Mask Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../assets/sleeping-mask.png')} 
            style={styles.sleepMask}
            resizeMode="contain"
          />
          <View style={styles.zContainer}>
            <Text style={[styles.zText, styles.z1]}>Z</Text>
            <Text style={[styles.zText, styles.z2]}>Z</Text>
            <Text style={[styles.zText, styles.z3]}>Z</Text>
          </View>
        </View>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Describe it you sleepy head..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶</Text>
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/compass-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#4C0099' }]}
            resizeMode="contain"
          />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/heart-fill.png')} 
            style={[styles.navIconImage, { tintColor: '#666' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c2c2c',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  sleepMask: {
    width: 160,
    height: 160,
  },
  zContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  zText: {
    fontSize: 24,
    color: '#4C0099',
    fontWeight: 'bold',
    position: 'absolute',
  },
  z1: {
    left: -20,
    top: 0,
    transform: [{ rotate: '-15deg' }],
  },
  z2: {
    left: 0,
    top: -5,
    transform: [{ rotate: '0deg' }],
  },
  z3: {
    left: 20,
    top: 0,
    transform: [{ rotate: '15deg' }],
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
  },
  inputField: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 20,
    paddingRight: 60,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  playButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 0, 153, 0.15)',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    // Clean glass effect
    shadowColor: '#4C0099',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    // Clean glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    // Subtle glass highlight
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
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

export default ExploreScreen;
