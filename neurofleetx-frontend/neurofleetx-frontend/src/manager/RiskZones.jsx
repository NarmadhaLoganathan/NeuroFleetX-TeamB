import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Layout from "../components/Layout";
import { AI } from "../api/aiApi";
import { useEffect, useState } from "react";
import L from "leaflet";
import { 
  MapPin, AlertTriangle, Activity, TrendingUp, 
  RefreshCw, Filter, Layers, Navigation2, Shield,
  Zap, Target
} from "lucide-react";

const RiskZonesMap = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [mapStyle, setMapStyle] = useState("standard");

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    setLoading(true);
    try {
      const res = await AI.riskZones();
      setZones(res.data || []);
    } catch (error) {
      console.error("Failed to load risk zones", error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced custom marker icons with animated pulse effect
  const createCustomIcon = (riskLevel) => {
    const config = {
      CRITICAL: { 
        color: "#dc2626", 
        icon: "⚠️",
        shadow: "0 0 20px rgba(220, 38, 38, 0.6)",
        pulse: "0 0 0 0 rgba(220, 38, 38, 0.7)"
      },
      HIGH: { 
        color: "#ea580c", 
        icon: "🔥",
        shadow: "0 0 15px rgba(234, 88, 12, 0.5)",
        pulse: "0 0 0 0 rgba(234, 88, 12, 0.7)"
      },
      MEDIUM: { 
        color: "#eab308", 
        icon: "⚡",
        shadow: "0 0 12px rgba(234, 179, 8, 0.4)",
        pulse: "0 0 0 0 rgba(234, 179, 8, 0.7)"
      },
      LOW: { 
        color: "#22c55e", 
        icon: "✓",
        shadow: "0 0 10px rgba(34, 197, 94, 0.3)",
        pulse: "0 0 0 0 rgba(34, 197, 94, 0.7)"
      }
    };

    const style = config[riskLevel] || config.MEDIUM;

    return L.divIcon({
      className: "custom-marker-wrapper",
      html: `
        <style>
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          @keyframes bounce-marker {
            0%, 100% {
              transform: translateY(0) rotate(-45deg);
            }
            50% {
              transform: translateY(-10px) rotate(-45deg);
            }
          }

          .marker-pin {
            animation: bounce-marker 2s ease-in-out infinite;
          }

          .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
        </style>
        
        <!-- Pulse Ring -->
        <div class="pulse-ring" style="
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${style.pulse};
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: ${style.shadow};
        "></div>
        
        <!-- Main Pin -->
        <div class="marker-pin" style="
          position: relative;
          background: linear-gradient(135deg, ${style.color} 0%, ${adjustBrightness(style.color, -20)} 100%);
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 4px solid white;
          box-shadow: ${style.shadow};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        ">
          <!-- Inner Glow -->
          <div style="
            position: absolute;
            inset: 4px;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent);
            border-radius: 50% 50% 50% 0;
          "></div>
          
          <!-- Icon -->
          <div style="
            transform: rotate(45deg);
            font-size: 20px;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          ">${style.icon}</div>
        </div>
        
        <!-- Bottom Shadow -->
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 8px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.3), transparent);
          border-radius: 50%;
        "></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -45],
    });
  };

  // Helper function to adjust color brightness
  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
      (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
      .toString(16).slice(1);
  };

  // Enhanced circle styling with gradient effect
  const getCircleOptions = (riskLevel, density) => {
    const configs = {
      CRITICAL: {
        color: "#dc2626",
        fillColor: "#dc2626",
        weight: 3,
        dashArray: "5, 10",
      },
      HIGH: {
        color: "#ea580c",
        fillColor: "#ea580c",
        weight: 3,
        dashArray: "5, 8",
      },
      MEDIUM: {
        color: "#eab308",
        fillColor: "#eab308",
        weight: 2,
        dashArray: "5, 5",
      },
      LOW: {
        color: "#22c55e",
        fillColor: "#22c55e",
        weight: 2,
        dashArray: "3, 6",
      }
    };

    return {
      ...configs[riskLevel] || configs.MEDIUM,
      fillOpacity: 0.12,
      opacity: 0.8,
      className: 'pulse-circle'
    };
  };

  const filteredZones = zones.filter(z => 
    filter === "ALL" || z.riskLevel === filter
  );

  const stats = {
    total: zones.length,
    critical: zones.filter(z => z.riskLevel === "CRITICAL").length,
    high: zones.filter(z => z.riskLevel === "HIGH").length,
    medium: zones.filter(z => z.riskLevel === "MEDIUM").length,
    low: zones.filter(z => z.riskLevel === "LOW").length,
  };

  const mapStyles = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center">
            <Shield className="w-8 h-8 mr-3 text-red-600" />
            Risk Zone Intelligence
          </h1>
          <p className="text-gray-600 mt-2">Real-time traffic risk monitoring with interactive visualization</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadZones}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 font-semibold">Total Zones</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
             onClick={() => setFilter(filter === "CRITICAL" ? "ALL" : "CRITICAL")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-2xl font-bold">{stats.critical}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Critical</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
             onClick={() => setFilter(filter === "HIGH" ? "ALL" : "HIGH")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-2xl font-bold">{stats.high}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">High Risk</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
             onClick={() => setFilter(filter === "MEDIUM" ? "ALL" : "MEDIUM")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⚡</span>
            <span className="text-2xl font-bold">{stats.medium}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Medium</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
             onClick={() => setFilter(filter === "LOW" ? "ALL" : "LOW")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">✓</span>
            <span className="text-2xl font-bold">{stats.low}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Low Risk</p>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center bg-white rounded-xl shadow-lg p-2 gap-2">
          <Layers className="w-5 h-5 text-gray-600 ml-2" />
          <button
            onClick={() => setMapStyle("standard")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              mapStyle === "standard" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setMapStyle("dark")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              mapStyle === "dark" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setMapStyle("satellite")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              mapStyle === "satellite" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Satellite
          </button>
        </div>

        {filter !== "ALL" && (
          <div className="flex items-center bg-orange-100 border-2 border-orange-300 rounded-xl px-4 py-2 gap-2">
            <Filter className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Filtered: {filter}</span>
            <button
              onClick={() => setFilter("ALL")}
              className="ml-2 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 text-sm font-semibold"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl px-4 py-2 gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">
            {filteredZones.length} {filteredZones.length === 1 ? 'Zone' : 'Zones'} Visible
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <Zap className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-gray-700 font-bold text-lg">Loading risk zones...</p>
              <p className="text-gray-500 text-sm mt-1">Analyzing traffic patterns</p>
            </div>
          </div>
        )}

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={mapStyles[mapStyle]}
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <MarkerClusterGroup
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            maxClusterRadius={60}
          >
            {filteredZones.map((z, i) => (
              <div key={i}>
                {/* Risk Circle */}
                <Circle
                  center={[z.latitude, z.longitude]}
                  radius={z.density * 150}
                  pathOptions={getCircleOptions(z.riskLevel, z.density)}
                />

                {/* Marker with Tooltip */}
                <Marker
                  position={[z.latitude, z.longitude]}
                  icon={createCustomIcon(z.riskLevel)}
                >
                  <Tooltip 
                    direction="top" 
                    offset={[0, -40]} 
                    opacity={0.95}
                    permanent={false}
                  >
                    <div className="text-center font-semibold">
                      <div className="text-gray-800">{z.location}</div>
                      <div className={`text-xs mt-1 ${
                        z.riskLevel === "CRITICAL" ? "text-red-600" :
                        z.riskLevel === "HIGH" ? "text-orange-600" :
                        z.riskLevel === "MEDIUM" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {z.riskLevel} RISK
                      </div>
                    </div>
                  </Tooltip>

                  <Popup className="custom-popup" maxWidth={280}>
                    <div className="p-3 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-200">
                        <div className={`p-2 rounded-lg ${
                          z.riskLevel === "CRITICAL" ? "bg-red-100" :
                          z.riskLevel === "HIGH" ? "bg-orange-100" :
                          z.riskLevel === "MEDIUM" ? "bg-yellow-100" :
                          "bg-green-100"
                        }`}>
                          <MapPin className={`w-5 h-5 ${
                            z.riskLevel === "CRITICAL" ? "text-red-600" :
                            z.riskLevel === "HIGH" ? "text-orange-600" :
                            z.riskLevel === "MEDIUM" ? "text-yellow-600" :
                            "text-green-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{z.location}</h3>
                          <p className="text-xs text-gray-500">Live Traffic Monitor</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-600" />
                              Vehicle Density
                            </span>
                            <span className="text-xl font-bold text-blue-700">{z.density}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${
                                z.density >= 80 ? "bg-red-500" :
                                z.density >= 60 ? "bg-orange-500" :
                                z.density >= 30 ? "bg-yellow-500" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(z.density, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className={`p-3 rounded-lg border-2 ${
                          z.riskLevel === "CRITICAL" ? "bg-red-50 border-red-300" :
                          z.riskLevel === "HIGH" ? "bg-orange-50 border-orange-300" :
                          z.riskLevel === "MEDIUM" ? "bg-yellow-50 border-yellow-300" :
                          "bg-green-50 border-green-300"
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Risk Assessment
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              z.riskLevel === "CRITICAL" ? "bg-red-600 text-white" :
                              z.riskLevel === "HIGH" ? "bg-orange-600 text-white" :
                              z.riskLevel === "MEDIUM" ? "bg-yellow-600 text-white" :
                              "bg-green-600 text-white"
                            }`}>
                              {z.riskLevel}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Navigation2 className="w-3 h-3" />
                            Coordinates: {z.latitude?.toFixed(4)}, {z.longitude?.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="mt-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Navigation2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Risk Level Legend</h2>
            <p className="text-sm text-gray-600">Interactive traffic risk classification</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="group relative bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow-md border-2 border-red-200 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">⚠️</span>
              </div>
              <div>
                <p className="font-bold text-red-700 text-lg">Critical</p>
                <p className="text-xs text-red-600 font-semibold">Density ≥ 80</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-md border-2 border-orange-200 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">🔥</span>
              </div>
              <div>
                <p className="font-bold text-orange-700 text-lg">High Risk</p>
                <p className="text-xs text-orange-600 font-semibold">Density 60-79</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl shadow-md border-2 border-yellow-200 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <div>
                <p className="font-bold text-yellow-700 text-lg">Medium</p>
                <p className="text-xs text-yellow-600 font-semibold">Density 30-59</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-md border-2 border-green-200 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">✓</span>
              </div>
              <div>
                <p className="font-bold text-green-700 text-lg">Low Risk</p>
                <p className="text-xs text-green-600 font-semibold">Density &lt; 30</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-1">Interactive Features</p>
                <p className="text-sm text-blue-700">
                  Click markers for detailed info. Circles show risk radius. Hover for quick preview.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-purple-800 font-semibold mb-1">Live Updates</p>
                <p className="text-sm text-purple-700">
                  Markers pulse with risk level. Dashed circles indicate active zones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiskZonesMap;