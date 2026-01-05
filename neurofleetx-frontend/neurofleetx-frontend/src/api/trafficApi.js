import api from "./axiosConfig";

export const Traffic = {
  getAll: () => api.get("/api/traffic"),
  getRecent: () => api.get("/api/traffic/recent"),
  create: (body) => api.post("/api/traffic", body),
  createByLocation: (body) => api.post("/api/traffic/by-location", body),
  update: (id, body) => api.put(`/api/traffic/${id}`, body),
  delete: (id) => api.delete(`/api/traffic/${id}`),
  byLocation: (loc) => api.get(`/api/traffic/location?location=${encodeURIComponent(loc)}`),
};