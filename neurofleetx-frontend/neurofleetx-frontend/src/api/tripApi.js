import api from "./axiosConfig";

export const Trips = {
  // Get all trips
  getAll: () => api.get("/api/trips"),

  // Get trip by id
  getById: (id) => api.get(`/api/trips/${id}`),

  // Driver-specific trips
  getByDriverId: (driverId) =>
    api.get(`/api/trips/driver/${driverId}`),

  // Create new trip
  create: (body) => api.post("/api/trips", body),

  // Update full trip
  update: (id, body) => api.put(`/api/trips/${id}`, body),

  // Update only status
  updateStatus: (id, status) =>
    api.put(`/api/trips/${id}/status?status=${status}`),

  // 🔥 END TRIP (Accepted distance)
  end: (tripId, distance = 0) =>
    api.put(`/api/trips/${tripId}/end?distance=${distance}`),

  // Get active trip (for crash recovery)
  getActive: (driverId) => api.get(`/api/trips/active/${driverId}`),

  // Delete trip
  delete: (id) => api.delete(`/api/trips/${id}`),
};

export default Trips;
