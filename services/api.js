// Temporary workaround - using fetch instead of axios
// Replace with axios once packages are installed
const axios = {
  create: (config) => {
    const instance = {
      ...config,
      interceptors: {
        request: {
          use: (fn) => {
            // Store the request interceptor
            instance._requestInterceptor = fn;
          }
        },
        response: {
          use: (fn) => {
            // Store the response interceptor
            instance._responseInterceptor = fn;
          }
        }
      },
      get: async (url, requestConfig = {}) => {
        let mergedConfig = { ...config, ...requestConfig };
        
        // Apply request interceptor if it exists
        if (instance._requestInterceptor) {
          mergedConfig = await instance._requestInterceptor(mergedConfig);
        }
        
        const response = await fetch(`${mergedConfig.baseURL}${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...mergedConfig.headers
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          const error = new Error(data.message || 'Request failed');
          error.response = { data, status: response.status };
          throw error;
        }
        
        return { data, status: response.status };
      },
      post: async (url, data, requestConfig = {}) => {
        let mergedConfig = { ...config, ...requestConfig };
        
        // Apply request interceptor if it exists
        if (instance._requestInterceptor) {
          mergedConfig = await instance._requestInterceptor(mergedConfig);
        }
        
        const response = await fetch(`${mergedConfig.baseURL}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...mergedConfig.headers
          },
          body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          const error = new Error(responseData.message || 'Request failed');
          error.response = { data: responseData, status: response.status };
          throw error;
        }
        
        return { data: responseData, status: response.status };
      }
    };
    return instance;
  }
};

// Temporary workaround - using a simple in-memory storage
const AsyncStorage = {
  getItem: async (key) => {
    return null;
  },
  setItem: async (key, value) => {
    console.log(`Would store ${key}: ${value}`);
  },
  removeItem: async (key) => {
    console.log(`Would remove ${key}`);
  }
};

// Base URL for your backend API
// Use your computer's IP address for React Native development
const BASE_URL = 'http://10.50.18.72:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

export default api;
