import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('laundry_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('laundry_token');
      localStorage.removeItem('laundry_user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.data?.error?.message) {
      toast.error(error.response.data.error.message);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;