import axios from "axios";

const API_URL = "http://localhost:9999/api/auth";

// export const login = (userData) => axios.post(`${API_URL}/login`, userData);
export const login = (userData) => axios.get(`${API_URL}/login`, {
    params: {
      email: userData.email,
      password: userData.password,
    },
  });
export const register = (userData) => axios.post(`${API_URL}/register`, userData);
export const updatePassword = (userData) => {
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  return axios.put(`${API_URL}/update-password`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
