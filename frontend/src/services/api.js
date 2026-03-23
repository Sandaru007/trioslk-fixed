import axios from 'axios';

// Create a custom instance of axios
const api = axios.create({
  // This is the ONE place your backend URL lives!
  baseURL: 'http://localhost:8000/api', 
});

export default api;