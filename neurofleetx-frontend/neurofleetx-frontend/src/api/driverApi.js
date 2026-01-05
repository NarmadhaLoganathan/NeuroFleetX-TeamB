import api from "./axiosConfig";

export const Drivers = {
  getAll: () => api.get("/api/drivers"),
  getById: (id) => api.get(`/api/drivers/${id}`),
  create: (body) => api.post("/api/drivers/create-full", body),
  update: (id, body) => api.put(`/api/drivers/${id}`, body),
  getByUserId: (userId) => api.get(`/api/drivers/user/${userId}`),
};
