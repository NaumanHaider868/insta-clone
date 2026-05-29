import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZmYyMmNkLTZiZTctNGYyMi1iYTQxLTI0NDdkNzdiZTE1ZCIsImVtYWlsIjoidXNlcjJAZ21haWwuY29tIiwicmVmZXJlbmNlIjoicUBGOSFyVCRNI2s3VnpCJnhAZFB1KmVZXk40VyFhWG9DMSIsImlhdCI6MTc4MDA0OTAyOCwiZXhwIjoxNzgwNjUzODI4fQ.U-3Mk8tTGg5VAlLEEozKQaTXmHU8XmWmaETpFOgEut0";
    
    if (token) {
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
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.error('Unauthorized - token expired or invalid');
    } else if (error.response?.status === 403) {
      console.error('Forbidden - insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api;
