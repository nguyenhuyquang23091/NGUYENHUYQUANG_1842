import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',  // Store ID
  state: () => ({
    token: localStorage.getItem('authToken') || null,  // Initialize from localStorage if available
    user: null,  
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,  // Check if there's a token
  },
  actions: {
    setAuthToken(token) {
      this.token = token;
      localStorage.setItem('authToken', token);  // Store token in localStorage
    },
    logout() {
      this.token = null;
      localStorage.removeItem('authToken');  // Remove token from localStorage
    },
  },
});