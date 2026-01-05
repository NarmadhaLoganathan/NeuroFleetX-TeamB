import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Vehicles } from "../api/vehicleApi";
import { AI } from "../api/aiApi";
import { GPS } from "../api/gpsApi";
import getUserIdFromStorage from "../utils/authUtils";
import { motion } from "framer-motion";
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTachometerAlt, 
  FaTools, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaIdCard,
  FaRoad,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaMapPin
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BiSolidMapPin } from "react-icons/bi";

const VehicleStatus = () => {
  const [vehicle, setVehicle] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [latestLog, setLatestLog] = useState(null);
  const [address, setAddress] = useState("Fetching location...");

  const driverId = getUserIdFromStorage();

  const loadGps = async (vehicleId) => {
    try {
      const res = await GPS.getVehicleLogs(vehicleId);
      const logs = (res.data || []).sort(
        (a, b) => new Date(b.loggedAt) - new Date(a.loggedAt)
      );
      const newLatestLog = logs[0] || null;
      setLatestLog(newLatestLog);

      if (newLatestLog) {
        fetchAddress(newLatestLog.latitude, newLatestLog.longitude);
      } else {
        setAddress("Location not available");
      }
    } catch (e) {
      console.error("Failed to load GPS logs", e);
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setAddress(data.display_name || "Unknown Location");
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address lookup failed");
    }
  };

  useEffect(() => {
    if (!driverId) {
      console.error("DEBUG: No driverId found!");
      return;
    }
    console.log("DEBUG: Fetching vehicle for userId:", driverId);

    Vehicles.getByUserId(driverId)
      .then((res) => {
        console.log("DEBUG: Vehicle fetch success:", res);
        const data = res.data;

        const v = Array.isArray(data) ? data[0] : data;

        if (!v) {
          console.warn("No vehicle assigned to driver");
          return;
        }

        setVehicle(v);

        AI.predictMaintenance(v.vehicleId)
          .then((m) => setMaintenance(m.data))
          .catch((err) => console.error("Maintenance AI error:", err));

        loadGps(v.vehicleId);
      })
      .catch((err) => {
        console.error("DEBUG: Vehicle fetch failed:", err);
        if (err.response) {
          console.error("DEBUG: Status:", err.response.status);
          console.error("DEBUG: Data:", err.response.data);
        }
      });
  }, [driverId]);

  useEffect(() => {
    if (!vehicle) return;
    const interval = setInterval(() => loadGps(vehicle.vehicleId), 10000);
    return () => clearInterval(interval);
  }, [vehicle]);

  const getStatusConfig = (status) => {
    const configs = {
      Active: { 
        color: "from-green-500 to-emerald-600", 
        icon: FaCheckCircle, 
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        pulse: "bg-green-500"
      },
      Inactive: { 
        color: "from-gray-500 to-gray-600", 
        icon: FaExclamationTriangle,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        pulse: "bg-gray-500"
      },
      Maintenance: { 
        color: "from-orange-500 to-red-600", 
        icon: FaTools,
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        pulse: "bg-orange-500"
      }
    };
    return configs[status] || configs.Active;
  };

  const getUrgencyConfig = (urgency) => {
    const configs = {
      Low: { color: "from-green-500 to-emerald-600", bg: "bg-green-50", text: "text-green-700", icon: FaCheckCircle },
      Medium: { color: "from-yellow-500 to-orange-600", bg: "bg-yellow-50", text: "text-yellow-700", icon: FaExclamationTriangle },
      High: { color: "from-red-500 to-pink-600", bg: "bg-red-50", text: "text-red-700", icon: FaExclamationTriangle }
    };
    return configs[urgency] || configs.Low;
  };

  if (!vehicle) {
    return (
      <Layout>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[70vh] px-4"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl shadow-2xl">
              <FaTruck className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 text-center"
          >
            No Vehicle Assigned
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 mt-3 text-center max-w-md text-sm md:text-base"
          >
            Please contact your fleet manager to assign a vehicle to your account.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <HiSparkles className="w-5 h-5" />
              Contact Manager
            </button>
          </motion.div>
        </motion.div>
      </Layout>
    );
  }

  const statusConfig = getStatusConfig(vehicle.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
                <FaTruck className="text-blue-600" />
                Vehicle Status
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Monitor your assigned vehicle in real-time</p>
            </div>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="hidden sm:block"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                <HiSparkles className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
        >
          {/* Vehicle Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 md:p-8 relative overflow-hidden">
            <motion.div
              animate={{ 
                x: [0, 100, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
            />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                >
                  <FaTruck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>
                
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    {vehicle.registrationNo}
                  </h2>
                  <p className="text-blue-100 mt-1 text-sm md:text-base flex items-center gap-2">
                    <FaIdCard className="w-4 h-4" />
                    {vehicle.vehicleType}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className={`px-6 py-3 ${statusConfig.bg} rounded-2xl border-2 ${statusConfig.border} shadow-lg backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 ${statusConfig.pulse} rounded-full blur-md opacity-50`}
                    />
                    <StatusIcon className={`w-5 h-5 ${statusConfig.text} relative z-10`} />
                  </div>
                  <span className={`font-bold ${statusConfig.text} text-lg`}>{vehicle.status}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
                      <FaTachometerAlt className="w-4 h-4" />
                      Total Distance
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-blue-900">{vehicle.totalDistance}</p>
                    <p className="text-blue-700 text-sm mt-1 font-medium">kilometers</p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <FaRoad className="w-12 h-12 md:w-16 md:h-16 text-blue-300" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-purple-600 font-semibold text-sm mb-2 flex items-center gap-2">
                      <FaIdCard className="w-4 h-4" />
                      Vehicle Type
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-purple-900">{vehicle.vehicleType}</p>
                    <p className="text-purple-700 text-sm mt-1 font-medium">Assigned Vehicle</p>
                  </div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaTruck className="w-12 h-12 md:w-16 md:h-16 text-purple-300" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg mb-6 md:mb-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-green-300 rounded-full blur-3xl opacity-20"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg"
                  >
                    <BiSolidMapPin className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-green-900 flex items-center gap-2">
                    Last Known Location
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <HiSparkles className="text-green-600" />
                    </motion.span>
                  </h3>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-green-200/50 shadow-inner">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <FaClock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-700 font-semibold mb-1">Last Updated</p>
                          <p className="text-lg md:text-xl font-bold text-green-900">
                            {latestLog
                              ? new Date(latestLog.loggedAt).toLocaleString()
                              : "No recent location"}
                          </p>
                        </div>
                      </div>
                      
                      {latestLog && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-start gap-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200"
                        >
                          <FaMapMarkerAlt className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-green-700 font-semibold mb-1">Address</p>
                            <p className="text-base md:text-lg text-green-900 font-medium leading-relaxed">
                              {address}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="hidden md:block"
                    >
                      <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl">
                        <FaMapPin className="w-16 h-16 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Maintenance Card */}
            {maintenance && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`${getUrgencyConfig(maintenance.urgency).bg} rounded-2xl p-6 border-2 ${getUrgencyConfig(maintenance.urgency).bg.replace('bg-', 'border-').replace('-50', '-200')} shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}
              >
                <motion.div
                  animate={{ 
                    x: [-100, 100, -100],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className={`absolute top-0 right-0 w-64 h-64 ${getUrgencyConfig(maintenance.urgency).bg.replace('-50', '-300')} rounded-full blur-3xl`}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className={`p-3 bg-gradient-to-br ${getUrgencyConfig(maintenance.urgency).color} rounded-xl shadow-lg`}
                    >
                      <FaTools className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold ${getUrgencyConfig(maintenance.urgency).text} flex items-center gap-2`}>
                        Maintenance Forecast
                        <motion.span
                          animate={{ rotate: [0, 20, -20, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FaCog className="w-6 h-6" />
                        </motion.span>
                      </h3>
                      <p className={`text-sm ${getUrgencyConfig(maintenance.urgency).text} opacity-80 mt-1`}>AI-Powered Predictions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaChartLine className={`w-5 h-5 ${getUrgencyConfig(maintenance.urgency).text}`} />
                        <p className={`text-sm font-semibold ${getUrgencyConfig(maintenance.urgency).text}`}>Next Service</p>
                      </div>
                      <p className={`text-3xl font-bold ${getUrgencyConfig(maintenance.urgency).text}`}>
                        {maintenance.nextServiceKm}
                      </p>
                      <p className={`text-sm ${getUrgencyConfig(maintenance.urgency).text} opacity-70 mt-1`}>kilometers</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {maintenance.urgency === 'High' ? (
                          <FaExclamationTriangle className={`w-5 h-5 ${getUrgencyConfig(maintenance.urgency).text}`} />
                        ) : maintenance.urgency === 'Medium' ? (
                          <FaExclamationTriangle className={`w-5 h-5 ${getUrgencyConfig(maintenance.urgency).text}`} />
                        ) : (
                          <FaCheckCircle className={`w-5 h-5 ${getUrgencyConfig(maintenance.urgency).text}`} />
                        )}
                        <p className={`text-sm font-semibold ${getUrgencyConfig(maintenance.urgency).text}`}>Urgency Level</p>
                      </div>
                      <p className={`text-3xl font-bold ${getUrgencyConfig(maintenance.urgency).text}`}>
                        {maintenance.urgency}
                      </p>
                      <div className="mt-2 w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: maintenance.urgency === 'High' ? '100%' : maintenance.urgency === 'Medium' ? '60%' : '30%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${getUrgencyConfig(maintenance.urgency).color}`}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/50 md:col-span-1 col-span-1"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className={`w-5 h-5 ${getUrgencyConfig(maintenance.urgency).text}`} />
                        <p className={`text-sm font-semibold ${getUrgencyConfig(maintenance.urgency).text}`}>Recommendation</p>
                      </div>
                      <p className={`text-base font-semibold ${getUrgencyConfig(maintenance.urgency).text} leading-relaxed`}>
                        {maintenance.recommendation}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50"
            />
            <div className="relative w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <p className="text-sm text-gray-600 font-medium">Live tracking active • Updates every 10 seconds</p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VehicleStatus;