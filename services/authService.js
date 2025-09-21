import api from './api';

// Simple in-memory storage for user session
let currentUser = null;
let currentPassword = null;

export const authService = {
  // Sign up a new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        // Store user data in memory
        currentUser = response.data.data.user;
        currentPassword = userData.password;
        
        return {
          success: true,
          user: response.data.data.user
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
        // Store user data in memory
        currentUser = response.data.data.user;
        currentPassword = credentials.password;
        
        return {
          success: true,
          user: response.data.data.user
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
      // Clear stored user data
      currentUser = null;
      currentPassword = null;
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Error during logout'
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      if (!currentUser || !currentPassword) {
        return {
          success: false,
          message: 'No user logged in'
        };
      }

      const response = await api.get(`/auth/me?email=${encodeURIComponent(currentUser.email)}&password=${encodeURIComponent(currentPassword)}`);
      
      if (response.data.success) {
        // Update stored user data with fresh data from server
        currentUser = response.data.data.user;
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
      if (currentUser && currentPassword) {
        return {
          isAuthenticated: true,
          user: currentUser
        };
      }
      
      return {
        isAuthenticated: false,
        user: null
      };
    } catch (error) {
      console.error('Check authentication error:', error);
      return {
        isAuthenticated: false,
        user: null
      };
    }
  },

  // Update user stats
  updateStats: async (stats) => {
    try {
      if (!currentUser || !currentPassword) {
        return {
          success: false,
          message: 'No user logged in'
        };
      }

      const response = await api.put('/auth/update-stats', {
        email: currentUser.email,
        password: currentPassword,
        ...stats
      });
      
      if (response.data.success) {
        // Update stored user data
        currentUser = response.data.data.user;
        return {
          success: true,
          user: response.data.data.user
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to update stats'
      };
    } catch (error) {
      console.error('Update stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error updating stats'
      };
    }
  }
};