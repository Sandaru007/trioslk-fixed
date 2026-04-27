import axios from 'axios';

// Create a custom instance of axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
});

// Request interceptor: Add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('trioslk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For FormData, don't override Content-Type (let browser set boundary)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('trioslk_token');
      sessionStorage.removeItem('trioslk_userInfo');
      window.location.href = '/login?message=SessionExpired';
    }
    return Promise.reject(error);
  }
);

export default api;