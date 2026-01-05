import api from "./axiosConfig";

export const AuthApi = {
  login: (body) => api.post("/api/auth/login", body),
  registerAdmin: (body, token) =>
    api.post("/api/auth/register", body, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  registerDriver: (body) => api.post("/api/auth/register", body),
};
