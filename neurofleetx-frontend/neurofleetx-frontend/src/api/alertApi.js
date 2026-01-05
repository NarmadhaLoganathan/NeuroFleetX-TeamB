import api from "./axiosConfig";

export const Alerts = {
  getAll: () => api.get("/api/alerts"),
  unresolved: () => api.get("/api/alerts/unresolved"),
  unresolvedForDriver: (userId) => api.get(`/api/alerts/unresolved/user/${userId}`),
  create: (body) => api.post("/api/alerts", body),
  resolve: (id) => api.put(`/api/alerts/${id}/resolve`),
};
