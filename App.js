import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { authService } from './services/authService';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('loading'); // 'loading', 'home', 'signin', 'signup', 'explore'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await authService.isAuthenticated();
      
      if (authStatus.isAuthenticated) {
        setUser(authStatus.user);
        setCurrentScreen('main'); // Show main app with home screen
      } else {
        setCurrentScreen('home'); // Show landing page
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setCurrentScreen('home');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    setCurrentScreen('signin');
  };

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentScreen('main');
  };

  const handleSignOut = async () => {
    await authService.signout();
    setUser(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b46c1" />
          <Text style={styles.loadingText}>Loading Sno Cast...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'signin') {
    return (
      <SignInScreen 
        navigation={{ navigate: setCurrentScreen }}
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen 
        navigation={{ navigate: setCurrentScreen }}
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentScreen === 'main') {
    return (
      <HomeScreen 
        user={user}
        onSignOut={handleSignOut}
        navigation={{ navigate: setCurrentScreen }}
      />
    );
  }

  if (currentScreen === 'explore') {
    return (
      <ExploreScreen 
        navigation={{ navigate: setCurrentScreen }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Sno</Text>
          <View style={styles.moonContainer}>
            <Image 
              source={require('./assets/sleeping.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.zLetters}>
              <Text style={styles.zText}>Z</Text>
              <Text style={[styles.zText, styles.zText2]}>Z</Text>
            </View>
          </View>
          <Text style={styles.logoText}>Cast</Text>
        </View>
      </View>

      {/* Sleeping Character Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.sleepingCharacter}>
          <Image 
            source={require('./assets/girl.png')} 
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.zzzBackground}>
          <Text style={[styles.zzzText, styles.zzz1]}>Z</Text>
          <Text style={[styles.zzzText, styles.zzz2]}>Z</Text>
          <Text style={[styles.zzzText, styles.zzz3]}>Z</Text>
          <Text style={[styles.zzzText, styles.zzz4]}>Z</Text>
          <Text style={[styles.zzzText, styles.zzz5]}>Z</Text>
        </View>
      </View>

      {/* Main Headline */}
      <View style={styles.headlineContainer}>
        <Text style={styles.mainHeadline}>
          Listen to your least{'\n'}
          favorite podcast to{'\n'}
          sleep on
        </Text>
        <Text style={styles.tagline}>
          We make sure they are boring af
        </Text>
      </View>

      {/* Call to Action Buttons */}
      <View style={styles.buttonContainer}>
        {user ? (
          <>
            <Text style={styles.welcomeText}>Welcome back, {user.username}!</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    // Gradient background effect
    background: 'linear-gradient(180deg, #f8f8f8 0%, #f0e6f7 100%)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.05,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c2c2c',
    letterSpacing: 1,
  },
  moonContainer: {
    position: 'relative',
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  zLetters: {
    position: 'absolute',
    top: -10,
    left: -5,
  },
  zText: {
    fontSize: 16,
    color: '#ffb347',
    fontWeight: 'bold',
    position: 'absolute',
  },
  zText2: {
    left: 8,
    top: 5,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: height * 0.06,
    position: 'relative',
  },
  sleepingCharacter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  characterImage: {
    width: 200,
    height: 200,
  },
  zzzBackground: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.3,
    zIndex: 1,
  },
  zzzText: {
    fontSize: 40,
    color: '#d8b3e8',
    fontWeight: 'bold',
    position: 'absolute',
    opacity: 0.6,
  },
  zzz1: {
    top: 20,
    left: 30,
    transform: [{ rotate: '-15deg' }],
  },
  zzz2: {
    top: 60,
    right: 40,
    transform: [{ rotate: '10deg' }],
  },
  zzz3: {
    top: 100,
    left: 60,
    transform: [{ rotate: '-5deg' }],
  },
  zzz4: {
    top: 140,
    right: 60,
    transform: [{ rotate: '20deg' }],
  },
  zzz5: {
    top: 180,
    left: 40,
    transform: [{ rotate: '-10deg' }],
  },
  headlineContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: height * 0.08,
  },
  mainHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c2c2c',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: height * 0.05,
  },
  signInButton: {
    backgroundColor: '#6b46c1',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButton: {
    paddingVertical: 12,
  },
  signUpButtonText: {
    color: '#6b46c1',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  welcomeText: {
    fontSize: 18,
    color: '#2c2c2c',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
