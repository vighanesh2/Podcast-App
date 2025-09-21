import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');


const ExploreScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Function to generate audio from text
  const generateAudio = async (text) => {
    try {
      setIsGeneratingAudio(true);
      const response = await fetch("http://10.50.18.72:5000/api/voice-generation/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: text,
          voice_mode: 0, // Sleepy voice for NapCasts
          filename: `napcast_${Date.now()}`
        }),
      });
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      console.log("Response status:", response.status);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed JSON response:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response was not JSON:", responseText);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (data.success) {
        // Construct the full URL for the audio file
        const audioUrl = `http://10.50.18.72:5000/api/voice-generation/audio/${data.data.filename}`;
        setAudioUrl(audioUrl);
        return audioUrl;
      } else {
        console.error("Audio generation failed:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      return null;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Define this function somewhere in your component
  const triggerNgrokEndpoint = async () => {
    if (isLoading) return; // Prevent multiple calls
    
    setIsLoading(true);
    try {
      const response = await fetch("https://dd70d0b87321.ngrok-free.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
      });
      console.log(description);
      const data = await response.json();
      console.log("Response from endpoint:", data);

      // Update state to display response
      const responseText = data.response || JSON.stringify(data);
      setResponseText(responseText);
      
      // Generate audio from the response text
      await generateAudio(responseText);
    } catch (error) {
      console.error("Error calling endpoint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.topPadding} />
      
      {/* Header */}
      <View style={styles.header}>
      </View>

      {/* Main Content Container */}
      <View style={styles.mainContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Create NapCasts</Text>
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

        {/* Input Field + Button */}
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
            <TouchableOpacity
              style={[styles.playButton, isLoading && styles.playButtonDisabled]}
              onPress={triggerNgrokEndpoint}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.playButtonText}>▶</Text>
              )}
            </TouchableOpacity>
        </View>
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Creating your NapCast...</Text>
          </View>
        )}
        
        {/* Audio generation indicator */}
        {isGeneratingAudio && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Generating audio...</Text>
          </View>
        )}
        
        {/* Response text display */}
        {responseText && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Your NapCast Script:</Text>
            <Text style={styles.responseText}>{responseText}</Text>
          </View>
        )}
        
        {/* Audio player */}
        {audioUrl && (
          <View style={styles.audioContainer}>
            <Text style={styles.audioTitle}>🎵 Your NapCast is ready!</Text>
            <TouchableOpacity style={styles.playAudioButton}>
              <Text style={styles.playAudioButtonText}>▶ Play NapCast</Text>
            </TouchableOpacity>
          </View>
        )}
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
    minHeight: 180,
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
  playButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0.1,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    width: '100%',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C0099',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  audioContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 10,
  },
  playAudioButton: {
    backgroundColor: '#4C0099',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  playAudioButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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