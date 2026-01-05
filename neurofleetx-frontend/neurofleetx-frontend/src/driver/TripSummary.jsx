import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Trips } from "../api/tripApi";
import { Drivers } from "../api/driverApi";
import { Loader2, MapPin, Clock, TrendingUp, CheckCircle, Route, Calendar } from "lucide-react";
import getUserIdFromStorage from "../utils/authUtils";
import { motion, AnimatePresence } from "framer-motion";

const TripSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async (idToFetch) => {
      try {
        if (idToFetch) {
          const res = await Trips.getById(idToFetch);
          setTrip(res.data);
          if (res.data?.driver?.driverId) {
            const historyRes = await Trips.getByDriverId(res.data.driver.driverId);
            const allTrips = historyRes.data || [];
            allTrips.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setHistory(allTrips);
          }
        } else {
          const userId = getUserIdFromStorage();
          if (userId) {
            const driverRes = await Drivers.getByUserId(userId);
            const driverInfo = driverRes.data;
            if (driverInfo && driverInfo.driverId) {
              const historyRes = await Trips.getByDriverId(driverInfo.driverId);
              const allTrips = historyRes.data || [];
              allTrips.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
              setHistory(allTrips);
              if (allTrips.length > 0) {
                setTrip(allTrips[0]);
              }
            } else {
              console.warn("Driver profile not found for user", userId);
            }
          } else {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Failed to load trip data", err);
      } finally {
        setLoading(false);
      }
    };
    const targetTripId = state?.tripId;
    loadData(targetTripId);
  }, [state, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-blue-600" size={48} />
          </motion.div>
        </div>
      </Layout>
    );
  }

  let durationStr = "-";
  let estDurationStr = "-";
  if (trip) {
    if (trip.startTime && trip.endTime) {
      const diffMs = new Date(trip.endTime) - new Date(trip.startTime);
      const diffMins = Math.round(diffMs / 60000);
      durationStr = diffMins === 0 ? "< 1 min" : `${diffMins} min`;
    }
    if (trip.startTime && trip.eta) {
      const estDiffMs = new Date(trip.eta) - new Date(trip.startTime);
      const estDiffMins = Math.round(estDiffMs / 60000);
      estDurationStr = `${estDiffMins} min`;
    }
  }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {trip ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mb-10"
            >
              {/* Header Banner */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
                />
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <CheckCircle className="text-white" size={64} />
                  </motion.div>
                  <h2 className="text-4xl font-bold text-white mb-2">Trip Completed!</h2>
                  <p className="text-green-100">Trip ID: #{trip.tripId}</p>
                </div>
              </motion.div>

              {/* Trip Summary Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Source */}
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-500"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase">Pickup Location</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-2">{trip.startLocation}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {trip.startTime ? new Date(trip.startTime).toLocaleString() : "-"}
                    </div>
                  </motion.div>

                  {/* Destination */}
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-2xl border-l-4 border-red-500"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase">Drop Location</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-2">{trip.endLocation}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {trip.endTime ? new Date(trip.endTime).toLocaleString() : "-"}
                    </div>
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center"
                  >
                    <Route className="mx-auto text-blue-600 mb-2" size={28} />
                    <p className="text-sm text-gray-500 font-medium mb-1">Distance</p>
                    <p className="text-3xl font-bold text-blue-600">{trip.distance}</p>
                    <p className="text-xs text-gray-500">kilometers</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center"
                  >
                    <Clock className="mx-auto text-purple-600 mb-2" size={28} />
                    <p className="text-sm text-gray-500 font-medium mb-1">Duration</p>
                    <p className="text-3xl font-bold text-purple-600">{durationStr}</p>
                    {estDurationStr !== "-" && (
                      <p className="text-xs text-gray-500">Est: {estDurationStr}</p>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center"
                  >
                    <CheckCircle className="mx-auto text-green-600 mb-2" size={28} />
                    <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                    <p className="text-xl font-bold text-green-600">Completed</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl text-center"
                  >
                    <TrendingUp className="mx-auto text-orange-600 mb-2" size={28} />
                    <p className="text-sm text-gray-500 font-medium mb-1">Avg Speed</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {trip.distance && durationStr !== "-" 
                        ? Math.round((trip.distance / (parseInt(durationStr) / 60)) * 10) / 10
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-500">km/h</p>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/driver/dashboard")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Back to Dashboard
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-10 bg-white p-12 rounded-3xl shadow-xl"
            >
              <Route className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Trip Summary</h2>
              <p className="text-gray-500">Select a trip from history to view details</p>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="text-blue-400" />
                Trip History
              </h3>
              <p className="text-gray-300 text-sm mt-1">Review your past journeys</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">Trip Details</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">Start Time</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">End Time</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">Duration</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">Distance</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {history.map((t, idx) => {
                      let durTxt = "-";
                      if (t.startTime && t.endTime) {
                        const m = Math.round((new Date(t.endTime) - new Date(t.startTime)) / 60000);
                        durTxt = m === 0 ? "< 1 min" : `${m} min`;
                      } else if (t.status === 'ONGOING' && t.startTime && t.eta) {
                        const m = Math.round((new Date(t.eta) - new Date(t.startTime)) / 60000);
                        durTxt = `Est. ${m} min`;
                      }
                      const isCurrent = trip && t.tripId === trip.tripId;
                      return (
                        <motion.tr
                          key={t.tripId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                          onClick={() => setTrip(t)}
                          className={`border-b cursor-pointer transition-all ${
                            isCurrent ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2">
                              <MapPin size={16} className="text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-gray-800">{t.startLocation}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-400 my-1">
                                  <span>↓</span>
                                </div>
                                <p className="font-bold text-gray-800 flex items-center gap-1">
                                  <MapPin size={16} className="text-red-600" />
                                  {t.endLocation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {t.startTime ? new Date(t.startTime).toLocaleString() : "-"}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {t.endTime ? new Date(t.endTime).toLocaleString() : "-"}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-700">{durTxt}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-700">{t.distance} km</span>
                          </td>
                          <td className="py-4 px-6">
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className={`px-3 py-1 rounded-xl text-xs font-bold inline-block ${
                                t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                t.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {t.status}
                            </motion.span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-16 text-center">
                        <Route className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 text-lg">No trip history found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TripSummary;