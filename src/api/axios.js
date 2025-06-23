import axios from 'axios';
import { logoutUser } from './authHelper';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    Accept: 'application/json', // For raisl to treat requests as API
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


// Catch token expiration and redirect
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default instance;