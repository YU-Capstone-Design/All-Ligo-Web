import axios from "axios";


export const normalizeAuthToken = (token) => {
  if (!token) return "";

  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

export const setAuthToken = (token) => {
  const normalizedToken = normalizeAuthToken(token);

  if (!normalizedToken) return;

  localStorage.setItem("ownerAccessToken", normalizedToken);
  api.defaults.headers.common.Authorization = normalizedToken;
};

const api = axios.create({

  
  baseURL: 'https://spring.allligo-agent.cloud',
  

  headers: {
    "Content-Type": "application/json",
  },
  
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = normalizeAuthToken(localStorage.getItem("ownerAccessToken"));

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ownerAccessToken");
      delete api.defaults.headers.common.Authorization;
    }

    return Promise.reject(error);
  },
);

export default api;
