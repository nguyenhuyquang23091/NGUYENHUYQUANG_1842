import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  async register(email, username, password) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error during user registration:', error);
      return error.response.data;
    }
  },
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error during user login:', error);
      return error.response.data;
    }
  }
};