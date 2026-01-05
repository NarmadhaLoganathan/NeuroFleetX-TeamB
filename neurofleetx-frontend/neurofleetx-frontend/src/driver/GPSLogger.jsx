import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Temp from "../components/Temp";
import { Trips } from "../api/tripApi";
import getUserIdFromStorage from "../utils/authUtils";
import { Navigation, StopCircle, Radio, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const GPSLogger = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [gpsLogs, setGpsLogs] = useState([]);
  const [routePath, setRoutePath] = useState(null);
  const [tripId, setTripId] = useState(state?.tripId || null);
  const userId = getUserIdFromStorage();
  const [routeSteps, setRouteSteps] = useState([]);
  const [nextStepIndex, setNextStepIndex] = useState(0);
  const [tripLocations, setTripLocations] = useState({
    start: state?.startLocation || null,
    end: state?.endLocation || null
  });

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    console.log("Nav:", text);
  };

  useEffect(() => {
    if (tripId && tripLocations.start && tripLocations.end) return;
    if (!userId) {
      alert("Not logged in!");
      navigate("/login");
      return;
    }
    Trips.getActive(userId)
      .then((res) => {
        if (res.data) {
          console.log("Recovered active trip:", res.data.tripId);
          setTripId(res.data.tripId);
          if (!tripLocations.start || !tripLocations.end) {
            setTripLocations({
              start: res.data.startLocation,
              end: res.data.endLocation
            });
          }
        } else {
          alert("No active trip found! Redirecting...");
          navigate("/driver/dashboard");
        }
      })
      .catch((err) => {
        console.error("Failed to recover trip:", err);
        navigate("/driver/dashboard");
      });
  }, [tripId, userId, navigate]);

  useEffect(() => {
    if (!tripId) return;
    let watchId;
    const fetchRoute = async () => {
      if (!tripLocations.start || !tripLocations.end) return;
      try {
        const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tripLocations.start)}`);
        if (!startRes.ok) throw new Error("Start location fetch failed");
        const startData = await startRes.json();
        const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tripLocations.end)}`);
        if (!endRes.ok) throw new Error("End location fetch failed");
        const endData = await endRes.json();
        if (startData?.[0] && endData?.[0]) {
          const sLat = startData[0].lat;
          const sLon = startData[0].lon;
          const eLat = endData[0].lat;
          const eLon = endData[0].lon;
          const routeRes = await fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&steps=true&geometries=geojson`);
          if (!routeRes.ok) throw new Error("Routing API failed");
          const routeJson = await routeRes.json();
          if (routeJson.routes?.[0]) {
            const route = routeJson.routes[0];
            const path = route.geometry.coordinates.map(c => [c[1], c[0]]);
            setRoutePath(path);
            if (route.legs && route.legs[0] && route.legs[0].steps) {
              setRouteSteps(route.legs[0].steps);
              setNextStepIndex(0);
              console.log("Navigation steps loaded:", route.legs[0].steps.length);
            }
          }
        }
      } catch (err) {
        console.error("Routing/Geocoding failed. Checking network...", err);
      }
    };
    fetchRoute();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Initial GPS Fix:", latitude, longitude);
          setGpsLogs((prev) => [...prev, { latitude, longitude }]);
        },
        (error) => console.error("Initial GPS Error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Real GPS:", latitude, longitude);
          setGpsLogs((prev) => [
            ...prev,
            { latitude, longitude }
          ]);
          if (routeSteps.length > 0 && nextStepIndex < routeSteps.length) {
            const step = routeSteps[nextStepIndex];
            const maneuver = step.maneuver;
            const [mLon, mLat] = maneuver.location;
            const dist = getDistance(latitude, longitude, mLat, mLon);
            if (dist < 40) {
              let instruction = "";
              if (maneuver.type === "arrive") {
                instruction = "You have arrived at your destination.";
              } else {
                const modifier = maneuver.modifier ? maneuver.modifier.replace("_", " ") : "";
                const type = maneuver.type || "turn";
                const roadName = step.name || "the road";
                instruction = `${type} ${modifier} onto ${roadName}`;
                if (modifier === "left" && type === "turn") instruction = `Turn left onto ${roadName}`;
                if (modifier === "right" && type === "turn") instruction = `Turn right onto ${roadName}`;
              }
              speak(instruction);
              setNextStepIndex(prev => prev + 1);
            }
          }
        },
        (error) => {
          console.error("GPS Error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      window.speechSynthesis.cancel();
    };
  }, [tripId, tripLocations, routeSteps, nextStepIndex]);

  const endTrip = async () => {
    if (!tripId) return;
    try {
      let totalDist = 0;
      for (let i = 0; i < gpsLogs.length - 1; i++) {
        totalDist += getDistance(
          gpsLogs[i].latitude,
          gpsLogs[i].longitude,
          gpsLogs[i + 1].latitude,
          gpsLogs[i + 1].longitude
        );
      }
      const distInKm = (totalDist / 1000).toFixed(2);
      console.log("Ending trip:", tripId, "Distance:", distInKm);
      await Trips.end(tripId, distInKm);
      navigate("/driver/trip-summary", {
        state: { tripId: tripId }
      });
    } catch (err) {
      alert("Failed to end trip");
      console.error(err);
    }
  };

  if (!tripId) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Navigation className="text-blue-600" size={48} />
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            />
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Radio className="text-white" size={32} />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white">Live Trip Tracking</h2>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <MapPin size={16} className="text-green-300" />
                  <span>{state?.startLocation || "Unknown"}</span>
                  <span className="mx-2">→</span>
                  <MapPin size={16} className="text-red-300" />
                  <span>{state?.endLocation || "Unknown"}</span>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl"
              >
                <p className="text-white text-sm font-medium">GPS Points Logged</p>
                <p className="text-3xl font-bold text-white">{gpsLogs.length}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
          >
            <Temp gpsLogs={gpsLogs} routePath={routePath} />
          </motion.div>

          {/* End Trip Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={endTrip}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <StopCircle size={28} />
            End Trip
          </motion.button>
        </div>
      </div>
    </Layout>
  );
};

export default GPSLogger;