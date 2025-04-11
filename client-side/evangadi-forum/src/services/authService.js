import axios from "axios";

const API_URL = "http://localhost:7700/api/users";

// Helper function for error handling
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg || error.message || "Request failed";
    throw new Error(errorMessage);
  }
};

const register = async (userData) => {
  return handleRequest(axios.post(`${API_URL}/register`, userData));
};

const login = async (credentials) => {
  const response = await handleRequest(
    axios.post(`${API_URL}/login`, credentials)
  );
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

const checkUser = async (token) => {
  return handleRequest(
    axios.get(`${API_URL}/checkUser`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

const resetPassword = async (token, newPassword) => {
  return handleRequest(
    axios.post(`${API_URL}/reset-password`, { token, newPassword })
  );
};

export default {
  register,
  login,
  checkUser,
  resetPassword,
};
