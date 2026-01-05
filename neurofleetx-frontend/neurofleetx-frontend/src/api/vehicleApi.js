import api from "./axiosConfig";

export const Vehicles = {
  getAll: () => api.get("/api/vehicles"),
  getById: (id) => api.get(`/api/vehicles/${id}`),
  create: (body) => api.post("/api/vehicles", body),
  update: (id, body) => api.put(`/api/vehicles/${id}`, body),
  delete: (id) => api.delete(`/api/vehicles/${id}`),

  // Driver-specific
  getByDriverId: (driverId) =>
    api.get(`/api/vehicles/driver/${driverId}`),
  getByUserId: (userId) => api.get(`/api/vehicles/user/${userId}`),
};
export default Vehicles;