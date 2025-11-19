import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const loginApi = (email, password) =>
  axios.post(`${API}/auth/login`, { email, password });

export const registerApi = (data) =>
  axios.post(`${API}/auth/register`, data);

export const meApi = (token) =>
  axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
