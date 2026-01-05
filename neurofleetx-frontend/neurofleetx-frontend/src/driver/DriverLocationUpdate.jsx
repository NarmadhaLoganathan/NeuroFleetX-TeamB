import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { GPS } from "../api/gpsApi";
import { Vehicles } from "../api/vehicleApi";
import { toast, ToastContainer } from "react-toastify";
import getUserIdFromStorage from "../utils/authUtils";
import { MapPin, Gauge, Send, Loader2, Navigation, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const DriverLocationUpdate = () => {
  const [vehicle, setVehicle] = useState(null);
  const [location, setLocation] = useState("");
  const [speed, setSpeed] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = getUserIdFromStorage();

  useEffect(() => {
    if (!userId) return;
    Vehicles.getByUserId(userId)
      .then((res) => {
        const data = res.data;
        const v = Array.isArray(data) ? data[0] : data;
        if (!v) {
          toast.error("No vehicle assigned to this driver");
          return;
        }
        setVehicle(v);
      })
      .catch(() => toast.error("Failed to load vehicle"));
  }, [userId]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!location.trim() || !speed) {
      toast.error("All fields required");
      return;
    }
    if (!vehicle?.registrationNo) {
      toast.error("Vehicle not assigned");
      return;
    }
    setLoading(true);
    try {
      await GPS.logByLocation(
        vehicle.registrationNo,
        location,
        Number(speed)
      );
      toast.success("Location updated successfully");
      setLocation("");
      setSpeed("");
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error(err.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-2xl mx-auto"
        >
          {/* Header Card */}
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Navigation className="text-white mb-4" size={40} />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Driver Check-In</h2>
              <p className="text-orange-100">Update your current location and status</p>
            </div>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-white/90"
            variants={cardVariants}
          >
            {vehicle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-l-4 border-blue-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Assigned Vehicle</p>
                    <p className="text-xl font-bold text-gray-800">{vehicle.registrationNo}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleCheckIn} className="space-y-6">
              {/* Location Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  Current Location
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Coimbatore, Tamil Nadu"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 font-medium"
                  required
                />
              </div>

              {/* Speed Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Gauge size={16} className="text-green-600" />
                  Current Speed (km/h)
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="Enter speed in km/h"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium"
                  min="0"
                  max="200"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    Update Location
                  </>
                )}
              </motion.button>
            </form>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Keep your location updated regularly for better fleet management and safety monitoring.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DriverLocationUpdate;