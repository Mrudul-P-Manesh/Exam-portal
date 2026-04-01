import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for handling global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token probably expired or invalid
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
