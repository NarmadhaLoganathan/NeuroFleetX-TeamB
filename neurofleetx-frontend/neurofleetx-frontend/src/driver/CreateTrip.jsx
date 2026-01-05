import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Trips } from "../api/tripApi";
import { Vehicles } from "../api/vehicleApi";
import getUserIdFromStorage from "../utils/authUtils";
import { MapPin, Navigation, Loader2, Map, Clock, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CreateTrip = () => {
  const driverId = getUserIdFromStorage();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    Vehicles.getByUserId(driverId)
      .then((res) => {
        const v = Array.isArray(res.data) ? res.data[0] : res.data;
        setVehicle(v);
      })
      .finally(() => setLoading(false));
  }, [driverId]);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setStartLocation(val);
    setShowSourceSuggestions(true);
    fetchSuggestions(val, setSourceSuggestions);
  };

  const handleDestChange = (e) => {
    const val = e.target.value;
    setEndLocation(val);
    setShowDestSuggestions(true);
    fetchSuggestions(val, setDestSuggestions);
  };

  const selectSource = (address) => {
    setStartLocation(address);
    setShowSourceSuggestions(false);
  };

  const selectDest = (address) => {
    setEndLocation(address);
    setShowDestSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported by this browser.");
      return;
    }
    setLocLoading(true);
    const fetchLocation = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };
    const handleSuccess = async (position) => {
      console.log("Location fetched successfully:", position);
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.display_name) {
          setStartLocation(data.display_name);
        } else {
          setStartLocation(`${latitude}, ${longitude}`);
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
        setStartLocation(`${latitude}, ${longitude}`);
      } finally {
        setLocLoading(false);
      }
    };
    const handleError = (error) => {
      console.warn("Location attempt failed:", error);
      return error;
    };
    console.log("Stage 1: Checking cached/low accuracy...");
    fetchLocation({ enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity })
      .then(handleSuccess)
      .catch((err1) => {
        handleError(err1);
        console.log("Stage 2: Forcing fresh low accuracy...");
        return fetchLocation({ enableHighAccuracy: false, timeout: 20000, maximumAge: 0 })
          .then(handleSuccess)
          .catch((err2) => {
            handleError(err2);
            console.log("Stage 3: Attempting High Accuracy GPS...");
            return fetchLocation({ enableHighAccuracy: true, timeout: 30000, maximumAge: 0 })
              .then(handleSuccess)
              .catch((finalErr) => {
                console.error("All location stages failed:", finalErr);
                let msg = "Could not detect location automatically.";
                if (finalErr.code === 1) msg = "Location access denied. Please allow permission.";
                else if (finalErr.code === 3) msg = "Location request timed out. Please enter address manually.";
                alert(msg);
                setLocLoading(false);
              });
          });
      });
  };

  const calculateRoute = async () => {
    if (!startLocation || !endLocation) return;
    setCalculating(true);
    setRouteInfo(null);
    try {
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocation)}`);
      const startData = await startRes.json();
      if (!startData?.[0]) throw new Error("Start location not found");
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endLocation)}`);
      const endData = await endRes.json();
      if (!endData?.[0]) throw new Error("End location not found");
      const sLat = startData[0].lat;
      const sLon = startData[0].lon;
      const eLat = endData[0].lat;
      const eLon = endData[0].lon;
      const routeRes = await fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=false`);
      const routeJson = await routeRes.json();
      if (routeJson.routes?.[0]) {
        const route = routeJson.routes[0];
        const distKm = (route.distance / 1000).toFixed(2);
        const durMin = Math.round(route.duration / 60);
        setRouteInfo({ distance: distKm, duration: durMin });
      }
    } catch (err) {
      console.error("Route calculation failed:", err);
      alert("Could not calculate route. Please check addresses.");
    } finally {
      setCalculating(false);
    }
  };

  const startTrip = async () => {
    if (!startLocation || !endLocation) {
      alert("Enter source and destination");
      return;
    }
    if (!routeInfo) {
      await calculateRoute();
    }
    const dist = routeInfo ? parseFloat(routeInfo.distance) : 0;
    const res = await Trips.create({
      driverId: vehicle.driverId,
      vehicleId: vehicle.vehicleId,
      startLocation,
      endLocation,
      distance: dist,
      startTime: new Date().toISOString(),
      status: "ONGOING",
    });
    navigate("/driver/gps", {
      state: {
        tripId: res.data.tripId,
        startLocation,
        endLocation,
      },
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-2xl mx-auto"
        >
          {/* Header Card */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden"
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
                <Map className="text-white mb-4" size={40} />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Start New Journey</h2>
              <p className="text-blue-100">Plan your route and hit the road!</p>
            </div>
          </motion.div>

          {/* Main Form Card */}
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-white/90"
            variants={cardVariants}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-600 font-medium">Loading vehicle information...</p>
              </div>
            ) : vehicle ? (
              <div className="space-y-6">
                {/* Vehicle Info */}
                <motion.div 
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-blue-600"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Your Vehicle</p>
                      <p className="text-xl font-bold text-gray-800">{vehicle.registrationNo}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Source Input */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" />
                    Pickup Location
                  </label>
                  <div className="flex gap-3">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="flex-1 border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 font-medium"
                      placeholder="Enter starting point..."
                      value={startLocation}
                      onChange={handleSourceChange}
                      onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                    />
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={{ scale: 0.95 }}
                      onClick={getCurrentLocation}
                      disabled={locLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      {locLoading ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <Navigation size={24} />
                      )}
                    </motion.button>
                  </div>
                  {showSourceSuggestions && sourceSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                    >
                      {sourceSuggestions.map((place, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
                          className="p-4 cursor-pointer text-sm border-b last:border-0 flex items-start gap-3"
                          onMouseDown={() => selectSource(place.display_name)}
                        >
                          <MapPin size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{place.display_name}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                {/* Destination Input */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-red-600" />
                    Destination
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800 font-medium"
                    placeholder="Where are you going?"
                    value={endLocation}
                    onChange={handleDestChange}
                    onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                  />
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                    >
                      {destSuggestions.map((place, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
                          className="p-4 cursor-pointer text-sm border-b last:border-0 flex items-start gap-3"
                          onMouseDown={() => selectDest(place.display_name)}
                        >
                          <MapPin size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{place.display_name}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                {/* Route Info Display */}
                {calculating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <Loader2 size={20} className="animate-spin text-blue-600" />
                    <p className="text-blue-700 font-medium">Calculating optimal route...</p>
                  </motion.div>
                )}

                {!calculating && routeInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Zap className="text-white" size={16} />
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">Route Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-4 rounded-xl shadow-sm"
                      >
                        <p className="text-sm text-gray-500 mb-1">Distance</p>
                        <p className="text-2xl font-bold text-green-600">{routeInfo.distance} km</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-4 rounded-xl shadow-sm"
                      >
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                          <Clock size={20} />
                          {routeInfo.duration} min
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <motion.button
                    whileHover={buttonHover}
                    whileTap={{ scale: 0.95 }}
                    onClick={calculateRoute}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Map size={20} />
                    Calculate Route
                  </motion.button>
                  <motion.button
                    whileHover={buttonHover}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTrip}
                    disabled={!startLocation || !endLocation}
                    className={`py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                      !startLocation || !endLocation
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    }`}
                  >
                    <Navigation size={20} />
                    Start Trip
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                </motion.div>
                <p className="text-gray-500 font-medium">No vehicle assigned</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateTrip;