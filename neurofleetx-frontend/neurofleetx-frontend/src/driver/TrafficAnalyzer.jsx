import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, CircleMarker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navigation, MapPin, Play, Loader2, Map, Clock, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const signalIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3256/3256783.png",
    iconSize: [20, 20],
});

function distToSegmentSquared(p, v, w) {
    var l2 = (v.lat - w.lat) * (v.lat - w.lat) + (v.lon - w.lon) * (v.lon - w.lon);
    if (l2 === 0) return (p.lat - v.lat) * (p.lat - v.lat) + (p.lon - v.lon) * (p.lon - v.lon);
    var t = ((p.lat - v.lat) * (w.lat - v.lat) + (p.lon - v.lon) * (w.lon - v.lon)) / l2;
    t = Math.max(0, Math.min(1, t));
    return (p.lat - (v.lat + t * (w.lat - v.lat))) * (p.lat - (v.lat + t * (w.lat - v.lat))) +
        (p.lon - (v.lon + t * (w.lon - v.lon))) * (p.lon - (v.lon + t * (w.lon - v.lon)));
}

function isPointNearPolyline(p, polyline, tolerance) {
    const tol2 = tolerance * tolerance;
    for (let i = 0; i < polyline.length - 1; i++) {
        const v = { lat: polyline[i][0], lon: polyline[i][1] };
        const w = { lat: polyline[i + 1][0], lon: polyline[i + 1][1] };
        if (distToSegmentSquared(p, v, w) < tol2) return true;
    }
    return false;
}

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
};

const TrafficAnalyzer = () => {
    const [sourceQuery, setSourceQuery] = useState("");
    const [destQuery, setDestQuery] = useState("");
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
    const [showDestSuggestions, setShowDestSuggestions] = useState(false);
    const [analyzedRoutes, setAnalyzedRoutes] = useState([]);
    const [allSignals, setAllSignals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [currentRouteSteps, setCurrentRouteSteps] = useState([]);
    const [nextStepIndex, setNextStepIndex] = useState(0);
    const mapRef = useRef(null);

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

    const getCurrentLocation = () => {
        if (!("geolocation" in navigator)) {
            alert("Geolocation not supported.");
            return;
        }
        setLocLoading(true);
        const fetchPos = (options) => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
        fetchPos({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
            .then(handleLocSuccess)
            .catch((err1) => {
                console.warn("High accuracy failed", err1);
                fetchPos()
                    .then(handleLocSuccess)
                    .catch(err => {
                        console.error("Location fallback failed", err);
                        let msg = "Could not get location.";
                        if (err.code === 1) msg = "Location permission denied.";
                        else if (err.code === 3) msg = "Location request timed out completely.";
                        alert(msg);
                        setLocLoading(false);
                    });
            });
    };

    const handleLocSuccess = async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setIsTracking(true);
        setIsUsingCurrentLocation(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            setSourceQuery(data.display_name || `${latitude}, ${longitude}`);
        } catch {
            setSourceQuery(`${latitude}, ${longitude}`);
        } finally {
            setLocLoading(false);
        }
    };

    useEffect(() => {
        if (!isNavigating && !isTracking) return;
        const id = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation([latitude, longitude]);
                if (currentRouteSteps.length > 0 && nextStepIndex < currentRouteSteps.length) {
                    const step = currentRouteSteps[nextStepIndex];
                    const maneuver = step.maneuver;
                    const [mLon, mLat] = maneuver.location;
                    const dist = getDistance(latitude, longitude, mLat, mLon);
                    if (dist < 40) {
                        const instruction = maneuver.type === "arrive"
                            ? "You have arrived."
                            : `${maneuver.type} ${maneuver.modifier || ""} onto ${step.name || "road"}`;
                        speak(instruction);
                        setNextStepIndex(prev => prev + 1);
                    }
                }
            },
            err => console.error(err),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(id);
    }, [isNavigating, isTracking, currentRouteSteps, nextStepIndex]);

    const speak = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(u);
        }
    };

    const analyzeTraffic = async () => {
        if (!sourceQuery || !destQuery) {
            alert("Please enter both Source and Destination");
            return;
        }
        setLoading(true);
        try {
            const geocode = async (q) => {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
                if (!res.ok) throw new Error("Geocoding failed");
                const data = await res.json();
                if (!data[0]) throw new Error("Location not found");
                return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            };
            let start;
            if (isUsingCurrentLocation && userLocation) {
                start = { lat: userLocation[0], lon: userLocation[1] };
            } else {
                start = await geocode(sourceQuery);
            }
            const end = await geocode(destQuery);
            const routeRes = await fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&steps=true&geometries=geojson&alternatives=true`);
            if (!routeRes.ok) throw new Error("Routing failed");
            const routeJson = await routeRes.json();
            const margin = 0.05;
            const minLat = Math.min(start.lat, end.lat) - margin;
            const maxLat = Math.max(start.lat, end.lat) + margin;
            const minLon = Math.min(start.lon, end.lon) - margin;
            const maxLon = Math.max(start.lon, end.lon) + margin;
            const overpassQuery = `[out:json][timeout:25];node["highway"="traffic_signals"](${minLat},${minLon},${maxLat},${maxLon});out body;`;
            let fetchedSignals = [];
            try {
                const opRes = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: overpassQuery });
                if (opRes.ok) {
                    const opData = await opRes.json();
                    fetchedSignals = (opData.elements || []).map(s => ({ ...s, lat: s.lat, lon: s.lon }));
                }
            } catch (e) { console.warn("Traffic signals fetch failed", e); }
            setAllSignals(fetchedSignals);
            const results = routeJson.routes.map((r, idx) => {
                const coords = r.geometry.coordinates.map(c => [c[1], c[0]]);
                const routeSignals = fetchedSignals.filter(s => isPointNearPolyline(s, coords, 0.0001));
                const signalPenalty = routeSignals.length * 60;
                return {
                    id: idx,
                    coordinates: coords,
                    distance: (r.distance / 1000).toFixed(1),
                    totalTimeStr: formatTime(r.duration + signalPenalty),
                    totalTimeVal: r.duration + signalPenalty,
                    signals: routeSignals,
                    signalCount: routeSignals.length,
                    steps: r.legs[0].steps
                };
            });
            results.sort((a, b) => a.totalTimeVal - b.totalTimeVal);
            results[0].isBest = true;
            setAnalyzedRoutes(results);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startNavigation = (route) => {
        setIsNavigating(true);
        setCurrentRouteSteps(route.steps);
        setNextStepIndex(0);
        speak("Starting navigation to destination.");
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const h = Math.floor(m / 60);
        return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full lg:w-96 bg-white shadow-2xl overflow-y-auto z-20 border-r border-gray-200"
                >
                    <div className="p-6">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                            />
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Map className="text-white mb-3" size={36} />
                                </motion.div>
                                <h1 className="text-2xl font-bold text-white mb-1">Route Optimizer</h1>
                                <p className="text-blue-100 text-sm">Find the fastest route with real-time traffic</p>
                            </div>
                        </div>

                        {/* Source Input */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={14} className="text-green-600" />
                                Source
                            </label>
                            <div className="flex gap-2">
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    placeholder="Enter start location..."
                                    value={sourceQuery}
                                    onChange={(e) => {
                                        setSourceQuery(e.target.value);
                                        setIsUsingCurrentLocation(false);
                                        setShowSourceSuggestions(true);
                                        fetchSuggestions(e.target.value, setSourceSuggestions);
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={getCurrentLocation}
                                    className="p-3 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-colors"
                                >
                                    {locLoading ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
                                </motion.button>
                            </div>
                            {showSourceSuggestions && sourceSuggestions.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                                >
                                    {sourceSuggestions.map((s, i) => (
                                        <motion.li
                                            key={i}
                                            whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
                                            className="p-3 cursor-pointer text-sm border-b last:border-0 flex items-start gap-2"
                                            onClick={() => { setSourceQuery(s.display_name); setShowSourceSuggestions(false); }}
                                        >
                                            <MapPin size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{s.display_name}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </div>

                        {/* Destination Input */}
                        <div className="mb-6 relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={14} className="text-red-600" />
                                Destination
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                                placeholder="Enter destination..."
                                value={destQuery}
                                onChange={(e) => {
                                    setDestQuery(e.target.value);
                                    setShowDestSuggestions(true);
                                    fetchSuggestions(e.target.value, setDestSuggestions);
                                }}
                            />
                            {showDestSuggestions && destSuggestions.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                                >
                                    {destSuggestions.map((s, i) => (
                                        <motion.li
                                            key={i}
                                            whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
                                            className="p-3 cursor-pointer text-sm border-b last:border-0 flex items-start gap-2"
                                            onClick={() => { setDestQuery(s.display_name); setShowDestSuggestions(false); }}
                                        >
                                            <MapPin size={14} className="text-purple-600 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{s.display_name}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </div>

                        {/* Analyze Button */}
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={analyzeTraffic}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Zap size={20} />
                                    Find Best Route
                                </>
                            )}
                        </motion.button>

                        {/* Navigation Status */}
                        {isNavigating && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border-2 border-green-500 p-4 mb-6 rounded-xl"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Navigation size={20} className="text-green-600" />
                                    </motion.div>
                                    <p className="font-bold text-green-800">Navigation Active</p>
                                </div>
                                <p className="text-sm text-green-700">Follow voice instructions. Drive safely!</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setIsNavigating(false); speak("Navigation stopped."); }}
                                    className="mt-3 text-xs text-red-600 underline font-semibold"
                                >
                                    Stop Navigation
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Routes List */}
                        <AnimatePresence>
                            {analyzedRoutes.map((route, i) => (
                                <motion.div
                                    key={route.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className={`p-5 rounded-2xl border-2 mb-4 transition-all ${
                                        route.isBest
                                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 shadow-lg"
                                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            {route.isBest && (
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Zap className="text-yellow-500" size={20} />
                                                </motion.div>
                                            )}
                                            <span className="font-bold text-lg">
                                                {route.isBest ? "Recommended Route" : `Alternative ${i}`}
                                            </span>
                                        </div>
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold"
                                        >
                                            {route.totalTimeStr}
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Map size={14} />
                                            <span>{route.distance} km</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={14} />
                                            <span>{route.signalCount} signals</span>
                                        </div>
                                    </div>
                                    {route.isBest && !isNavigating && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => startNavigation(route)}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Play size={18} />
                                            Start Navigation
                                        </motion.button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Map Container */}
                <div className="flex-1 h-96 lg:h-auto relative">
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                        <TileLayer attribution="&copy; OSM" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {userLocation && <RecenterMap center={userLocation} />}
                        {[...analyzedRoutes].reverse().map(route => (
                            <Polyline key={route.id} positions={route.coordinates} color={route.isBest ? "#2563eb" : "#9ca3af"} weight={route.isBest ? 6 : 4} opacity={route.isBest ? 0.9 : 0.6}>
                                <Tooltip>{route.isBest ? "Best Route" : "Alternative"}<br />ETA: {route.totalTimeStr}</Tooltip>
                            </Polyline>
                        ))}
                        {allSignals.map((s, i) => <Marker key={i} position={[s.lat, s.lon]} icon={signalIcon}><Popup>Traffic Signal</Popup></Marker>)}
                        {userLocation && (
                            <>
                                <CircleMarker center={userLocation} radius={8} pathOptions={{ color: 'white', fillColor: '#4285F4', fillOpacity: 1 }} />
                                <Circle center={userLocation} radius={50} pathOptions={{ fillColor: '#4285F4', fillOpacity: 0.15, weight: 0 }} />
                            </>
                        )}
                    </MapContainer>
                </div>
            </div>
        </Layout>
    );
};

export default TrafficAnalyzer;