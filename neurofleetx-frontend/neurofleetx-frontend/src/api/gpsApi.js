import api from "./axiosConfig";

export const GPS = {
  // Hardware log
  log: (vehicleId, latitude, longitude, speed) =>
    api.post(`/api/gps/log?vehicleId=${vehicleId}&latitude=${latitude}&longitude=${longitude}&speed=${speed}`),
  
  // NEW: Manual Driver Check-in (Text)
  logByLocation: (registrationNo, location, speed) =>
    api.post(
      `/api/gps/log-location?registrationNo=${registrationNo}&location=${encodeURIComponent(
        location
      )}&speed=${speed}`
    ),

  getVehicleLogs: (vehicleId) => api.get(`/api/gps/vehicle/${vehicleId}`),
  
  // NEW: Fetch all vehicles' latest status
  getFleetLive: () => api.get("/api/gps/fleet-live"),
};