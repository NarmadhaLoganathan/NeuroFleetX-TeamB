import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Alerts } from "../api/alertApi";
import getUserIdFromStorage from "../utils/authUtils";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DriverAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const driverId = getUserIdFromStorage();

  useEffect(() => {
    Alerts.unresolved()
      .then((res) => setAlerts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to fetch alerts:", err));
  }, []);

  const handleResolve = async (id) => {
    try {
      await Alerts.resolve(id);
      setAlerts(alerts.filter(a => a.alertId !== id));
      if (selectedAlert?.alertId === id) setSelectedAlert(null);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      HIGH: {
        bg: "from-red-500 to-rose-600",
        border: "border-red-500",
        icon: XCircle,
        glow: "shadow-red-500/50",
        textColor: "text-red-700",
        bgLight: "bg-red-50"
      },
      MEDIUM: {
        bg: "from-orange-500 to-amber-600",
        border: "border-orange-500",
        icon: AlertCircle,
        glow: "shadow-orange-500/50",
        textColor: "text-orange-700",
        bgLight: "bg-orange-50"
      },
      LOW: {
        bg: "from-yellow-500 to-yellow-600",
        border: "border-yellow-500",
        icon: AlertTriangle,
        glow: "shadow-yellow-500/50",
        textColor: "text-yellow-700",
        bgLight: "bg-yellow-50"
      }
    };
    return configs[severity] || configs.MEDIUM;
  };

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
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl"
              />
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <Shield className="text-white" size={32} />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Alert Center
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor and manage your vehicle alerts</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
                >
                  {alerts.length} Active Alerts
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 shadow-xl text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
              <p className="text-gray-500">No active alerts. Drive safe! 🎉</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const config = getSeverityConfig(alert.severity);
                const Icon = config.icon;

                return (
                  <motion.div
                    key={alert.alertId}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-8 ${config.border}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon Section */}
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${config.bg} rounded-xl flex items-center justify-center shadow-lg ${config.glow}`}
                        >
                          <Icon className="text-white" size={28} />
                        </motion.div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {alert.alertType}
                              </h3>
                              <p className="text-gray-600 leading-relaxed line-clamp-2">
                                {alert.description}
                              </p>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`px-4 py-2 rounded-xl font-bold text-sm ${config.bgLight} ${config.textColor} shadow-sm whitespace-nowrap`}
                            >
                              {alert.severity}
                            </motion.div>
                          </div>

                          {/* Footer with actions */}
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedAlert(alert)}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                            >
                              View Details
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleResolve(alert.alertId)}
                              className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
                            >
                              Resolve
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-1 bg-gradient-to-r ${config.bg} origin-left`}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: "High Priority", count: alerts.filter(a => a.severity === "HIGH").length, color: "from-red-500 to-rose-600" },
              { label: "Medium Priority", count: alerts.filter(a => a.severity === "MEDIUM").length, color: "from-orange-500 to-amber-600" },
              { label: "Low Priority", count: alerts.filter(a => a.severity === "LOW").length, color: "from-yellow-500 to-yellow-600" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <p className="text-gray-500 text-sm font-medium mb-2">{stat.label}</p>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.count}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Alert Details Modal */}
          <AnimatePresence>
            {selectedAlert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={() => setSelectedAlert(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XCircle size={28} />
                  </button>

                  <div className="flex items-center gap-4 mb-6 pr-8">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${getSeverityConfig(selectedAlert.severity).bg} shadow-lg`}>
                      <AlertTriangle className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedAlert.alertType}</h2>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getSeverityConfig(selectedAlert.severity).bgLight} ${getSeverityConfig(selectedAlert.severity).textColor}`}>
                        {selectedAlert.severity} PRIORITY
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Description</p>
                      <p className="text-gray-700 leading-relaxed">{selectedAlert.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Date</p>
                        <p className="text-gray-700 font-medium">{selectedAlert.createdAt ? new Date(selectedAlert.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Vehicle</p>
                        <p className="text-gray-700 font-medium">{selectedAlert.vehicle ? selectedAlert.vehicle.registrationNo : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleResolve(selectedAlert.alertId);
                      }}
                      className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
                    >
                      Resolve Alert
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default DriverAlerts;