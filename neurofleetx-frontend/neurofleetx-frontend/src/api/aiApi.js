import api from "./axiosConfig";

// ===== Existing AI APIs (UNCHANGED) =====
export const AI = {
  predictCongestion: (location) =>
    api.get(`/api/ai/predict-congestion`, {
      params: { location },
    }),

  suggestRoute: (start, end, vehicleId) =>
    api.get(`/api/ai/suggest-route`, {
      params: { start, end, vehicleId },
    }),

  detectIncidents: (vehicleId) =>
    api.post(`/api/ai/detect-incidents/${vehicleId}`),

  analyzeDriverBehavior: (driverId, tripId) =>
    api.get(`/api/ai/driver-behavior`, {
      params: { driverId, tripId },
    }),

  getDriverBehaviorScore: (driverId) =>
    api.get(`/api/driver/behavior/${driverId}`),

  predictMaintenance: (vehicleId) =>
    api.get(`/api/ai/predict-maintenance/${vehicleId}`),

  riskZones: () => api.get(`/api/ai/risk-zones`),

  predictETA: (tripId, currentDistance, totalDistance) =>
    api.get(`/api/ai/predict-eta`, {
      params: { tripId, currentDistance, totalDistance },
    }),
};

// ===== DRIVER CHATBOT API =====
export const AIChat = {
  sendMessage: (message) =>
    api.post("/api/ai/chat", { message }),
};

export default AIChat;
