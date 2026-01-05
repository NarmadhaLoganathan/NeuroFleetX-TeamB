import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { Trips } from "../api/tripApi";
import { Drivers } from "../api/driverApi";
import { Alerts } from "../api/alertApi";
import { MapPin, AlertTriangle, Map, Play, Clock, TrendingUp, Activity, CheckCircle } from "lucide-react";
import getUserIdFromStorage from "../utils/authUtils";
import { motion } from "framer-motion";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [driverName, setDriverName] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = getUserIdFromStorage();

  useEffect(() => {
    if (!userId) return;
    const initDashboard = async () => {
      try {
        const driverRes = await Drivers.getByUserId(userId);
        const driverInfo = driverRes.data;
        if (driverInfo && driverInfo.driverId) {
          setDriverName(driverInfo.name);
          const tripsRes = await Trips.getByDriverId(driverInfo.driverId);
          setTrips(tripsRes.data || []);
          const alertsRes = await Alerts.unresolved(driverInfo.driverId);
          setAlerts(alertsRes.data || []);
        }
      } catch (error) {
        console.error("Dashboard init error:", error);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [userId]);

  const quickActions = [
    { to: "/driver/create-trip", icon: Map, label: "Start Trip", color: "from-green-500 to-emerald-600" },
    { to: "/driver/traffic-analysis", icon: Activity, label: "Traffic Analysis", color: "from-purple-500 to-purple-600" },
    { to: "/driver/vehicle", icon: MapPin, label: "Vehicle Status", color: "from-blue-500 to-blue-600" },
    { to: "/driver/check-in", icon: CheckCircle, label: "Check-In", color: "from-orange-500 to-orange-600" },
    { to: "/driver/trip-summary", icon: Clock, label: "Trip History", color: "from-gray-500 to-gray-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
            />
            <div className="relative z-10">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl md:text-5xl font-bold text-white mb-2"
              >
                Welcome back, <span className="text-yellow-300">{driverName || "Driver"}</span>
              </motion.h1>
              <p className="text-blue-100 text-lg">Here's what's happening today</p>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatsCard title="Total Trips" value={trips.length} icon={Map} color="from-blue-500 to-blue-600" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="from-red-500 to-rose-600" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Vehicle Status" value="Active" icon={MapPin} color="from-green-500 to-emerald-600" />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} to={action.to}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <Icon className="text-white" size={28} />
                    </motion.div>
                    <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-purple-600" />
              Recent Trips
            </h2>
            {trips.length > 3 && (
              <Link to="/driver/trip-summary">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  View All →
                </motion.button>
              </Link>
            )}
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Map className="mx-auto text-gray-300 mb-4" size={64} />
              </motion.div>
              <p className="text-gray-500 text-lg">No trips found. Start your first journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 3).map((t) => (
                <motion.div
                  key={t.tripId}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex justify-between items-center p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all border border-gray-100 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                      <MapPin size={18} className="text-green-600" />
                      {t.startLocation}
                      <span className="text-gray-400 mx-2">→</span>
                      <MapPin size={18} className="text-red-600" />
                      {t.endLocation}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(t.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Map size={14} />
                        {t.distance} km
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`px-4 py-2 text-sm rounded-xl font-bold shadow-sm ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        t.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {t.status}
                    </motion.span>
                    {t.status === 'ONGOING' && (
                      <Link to="/driver/gps" state={{ tripId: t.tripId }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <Play size={16} />
                          Resume
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;