import api from './api';
// Temporary workaround - using a simple in-memory storage
// Replace with AsyncStorage once packages are installed
const AsyncStorage = {
  getItem: async (key) => {
    // This is a temporary implementation
    // In a real app, this would use @react-native-async-storage/async-storage
    return null;
  },
  setItem: async (key, value) => {
    // This is a temporary implementation
    console.log(`Would store ${key}: ${value}`);
  },
  removeItem: async (key) => {
    // This is a temporary implementation
    console.log(`Would remove ${key}`);
  }
};

export const authService = {
  // Sign up a new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.token
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Signup failed'
      };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        return {
          success: false,
          message: errorMessages
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Network error during signup'
      };
    }
  },

  // Sign in existing user
  signin: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      
      if (response.data.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.token
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Signin failed'
      };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error during signin'
      };
    }
  },

  // Sign out user
  signout: async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.data.user
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to get user data'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error getting user data'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        return {
          isAuthenticated: true,
          user: JSON.parse(userData),
          token
        };
      }
      
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    } catch (error) {
      console.error('Check authentication error:', error);
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      
      if (response.data.success) {
        await AsyncStorage.setItem('authToken', response.data.data.token);
        
        return {
          success: true,
          token: response.data.data.token
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Token refresh failed'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error refreshing token'
      };
    }
  }
};
