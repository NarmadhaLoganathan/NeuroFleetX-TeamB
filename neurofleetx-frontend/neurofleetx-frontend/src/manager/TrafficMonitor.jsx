import Layout from "../components/Layout";
import { Traffic } from "../api/trafficApi";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Activity, TrendingUp, TrendingDown, AlertTriangle,
  MapPin, RefreshCw, BarChart3, Navigation,
  Gauge, Clock, Zap, Target
} from "lucide-react";

const TrafficMonitor = () => {
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("avgSpeed");

  useEffect(() => {
    loadTraffic();
    const interval = setInterval(loadTraffic, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadTraffic = async () => {
    setLoading(true);
    try {
      const res = await Traffic.getAll();
      setTraffic(res.data || []);
    } catch (error) {
      console.error("Failed to load traffic data", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalLocations: traffic.length,
    avgDensity: traffic.length > 0 
      ? (traffic.reduce((sum, t) => sum + (t.vehicleDensity || 0), 0) / traffic.length).toFixed(1)
      : 0,
    avgSpeed: traffic.length > 0
      ? (traffic.reduce((sum, t) => sum + (t.avgSpeed || 0), 0) / traffic.length).toFixed(1)
      : 0,
    criticalZones: traffic.filter(t => t.congestionLevel === "CRITICAL").length,
    highZones: traffic.filter(t => t.congestionLevel === "HIGH").length,
    mediumZones: traffic.filter(t => t.congestionLevel === "MEDIUM").length,
    lowZones: traffic.filter(t => t.congestionLevel === "LOW").length,
  };

  // Pie chart data
  const congestionData = [
    { name: "Critical", value: stats.criticalZones, color: "#dc2626" },
    { name: "High", value: stats.highZones, color: "#ea580c" },
    { name: "Medium", value: stats.mediumZones, color: "#eab308" },
    { name: "Low", value: stats.lowZones, color: "#22c55e" },
  ].filter(item => item.value > 0);

  // Get congestion badge
  const getCongestionBadge = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-300";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  // Get congestion icon
  const getCongestionIcon = (level) => {
    switch (level) {
      case "CRITICAL": return "🔴";
      case "HIGH": return "🟠";
      case "MEDIUM": return "🟡";
      default: return "🟢";
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (loading && traffic.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Activity className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Activity className="w-8 h-8 mr-3 text-blue-600" />
            Traffic Monitor
          </h1>
          <p className="text-gray-600 mt-2">Real-time traffic analytics and insights</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-100 border-2 border-green-300 rounded-xl px-4 py-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-semibold text-sm">Live</span>
          </div>
          
          <button
            onClick={loadTraffic}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <MapPin className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.totalLocations}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Locations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Gauge className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.avgDensity}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Avg Density</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Navigation className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.avgSpeed}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Avg Speed</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🔴</span>
            <span className="text-3xl font-bold">{stats.criticalZones}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Critical</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🟠</span>
            <span className="text-3xl font-bold">{stats.highZones}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">High</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🟢</span>
            <span className="text-3xl font-bold">{stats.lowZones}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Low Risk</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Area Chart - Speed Trend */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Speed & Density Trends</h2>
                <p className="text-sm text-gray-500">Across all monitored locations</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric("avgSpeed")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedMetric === "avgSpeed"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Speed
              </button>
              <button
                onClick={() => setSelectedMetric("vehicleDensity")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedMetric === "vehicleDensity"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Density
              </button>
            </div>
          </div>

          {traffic.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BarChart3 className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-lg">No traffic data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={traffic.slice(0, 15)}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={selectedMetric === "avgSpeed" ? "#3b82f6" : "#a855f7"} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={selectedMetric === "avgSpeed" ? "#3b82f6" : "#a855f7"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="location" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetric === "avgSpeed" ? "#3b82f6" : "#a855f7"}
                  strokeWidth={3}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart - Congestion Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Congestion Split</h2>
              <p className="text-sm text-gray-500">Distribution by risk level</p>
            </div>
          </div>

          {congestionData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Activity className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-lg">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={congestionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {congestionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar Chart - Top Congested Areas */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Top Congested Locations</h2>
            <p className="text-sm text-gray-500">Highest vehicle density zones</p>
          </div>
        </div>

        {traffic.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MapPin className="w-16 h-16 mb-3 opacity-50" />
            <p className="text-lg">No traffic data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={traffic.sort((a, b) => (b.vehicleDensity || 0) - (a.vehicleDensity || 0)).slice(0, 10)}>
              <XAxis 
                dataKey="location" 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="vehicleDensity" radius={[8, 8, 0, 0]}>
                {traffic.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.vehicleDensity >= 80 ? "#dc2626" :
                      entry.vehicleDensity >= 60 ? "#ea580c" :
                      entry.vehicleDensity >= 30 ? "#eab308" :
                      "#22c55e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Traffic Data Cards */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Live Traffic Data</h2>
              <p className="text-sm text-gray-500">All monitored locations</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
            {traffic.length} Locations
          </div>
        </div>

        {traffic.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Activity className="w-16 h-16 mb-3 opacity-50" />
            <p className="text-lg">No traffic data found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {traffic.map((t) => (
              <div
                key={t.trafficId}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{t.location}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(t.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 flex items-center gap-1 ${getCongestionBadge(t.congestionLevel)}`}>
                    {getCongestionIcon(t.congestionLevel)}
                    {t.congestionLevel}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                        <Gauge className="w-4 h-4 text-purple-600" />
                        Density
                      </span>
                      <span className="text-xl font-bold text-purple-700">{t.vehicleDensity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          t.vehicleDensity >= 80 ? "bg-red-500" :
                          t.vehicleDensity >= 60 ? "bg-orange-500" :
                          t.vehicleDensity >= 30 ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(t.vehicleDensity, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                        <Navigation className="w-4 h-4 text-cyan-600" />
                        Avg Speed
                      </span>
                      <span className="text-xl font-bold text-cyan-700">{t.avgSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Traffic Insights</h3>
            <p className="text-blue-800 text-sm">
              Monitoring <strong>{stats.totalLocations}</strong> locations with average density of <strong>{stats.avgDensity}</strong> vehicles
              and average speed of <strong>{stats.avgSpeed} km/h</strong>. 
              {stats.criticalZones > 0 && (
                <span className="text-red-700 font-semibold"> ⚠️ {stats.criticalZones} critical zone{stats.criticalZones !== 1 ? 's' : ''} require immediate attention!</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrafficMonitor;