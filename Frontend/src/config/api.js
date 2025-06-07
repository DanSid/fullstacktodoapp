// Check if we're in development or production
const isDevelopment = import.meta.env.DEV;

// Use different base URLs for different environments
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000'  // Development
  : 'https://fullstack-todolist-upnv.onrender.com'; // Production

export const API_ENDPOINTS = {
  TODOS: `${API_BASE_URL}/api/todos`,
  GET_TODOS: `${API_BASE_URL}/api/gettodos`,
  USERS: `${API_BASE_URL}/api/users`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;