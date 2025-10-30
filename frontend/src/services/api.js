import axios from 'axios';

// Use your live Render backend URL
const API_BASE_URL = 'https://student-feedback-luct.onrender.com/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getAllFeedback: () => api.get('/feedback'),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
  getDashboardStats: () => api.get('/dashboard/stats'),
  getCourseStats: () => api.get('/dashboard/course-stats'),
  healthCheck: () => api.get('/health'),
};

export default api;