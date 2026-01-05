// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth'; // Ensure this matches your backend URL

const authService = {
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      // authService now returns response.data directly as per your previous request
      return response.data;
    } catch (error) {
      console.error('Error in forgotPassword:', error.response?.data || error.message);
      // Throw the backend's message or a generic error
      throw error.response?.data || 'An unexpected error occurred.';
    }
  },

  resetPassword: async (email, otpCode, newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otpCode,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error in resetPassword:', error.response?.data || error.message);
      throw error.response?.data || 'An unexpected error occurred.';
    }
  },

  registerUser: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, payload);
      // Assuming your backend for register also returns a string message directly in response.data
      return response.data;
    } catch (error) {
      console.error('Error in registerUser:', error.response?.data || error.message);
      // This will throw the backend's specific error message (e.g., "Email already registered!")
      throw error.response?.data || 'Registration failed unexpectedly.';
    }
  },
};

export default authService;