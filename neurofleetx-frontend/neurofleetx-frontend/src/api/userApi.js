import api from "./axiosConfig";

export const Users = {
  getAll: () => api.get("/api/users"),
  update: (id, body) => api.put(`/api/users/${id}`, body),
  delete: (id) => api.delete(`/api/users/${id}`),
};