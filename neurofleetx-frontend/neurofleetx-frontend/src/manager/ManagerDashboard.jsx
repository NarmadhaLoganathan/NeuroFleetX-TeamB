import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Vehicles } from "../api/vehicleApi";
import { Alerts } from "../api/alertApi";
import { Traffic } from "../api/trafficApi";
import { AI } from "../api/aiApi";
import { 
  Car, AlertTriangle, Map, TrendingUp, Activity,
  MapPin, Gauge, Navigation, Zap, Shield, 
  BarChart3, Clock, RefreshCw, ArrowRight,
  CheckCircle, XCircle, Fuel, Target
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Link } from "react-router-dom";
import TrafficMonitor from "./TrafficMonitor";

const ManagerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, alertsRes, trafficRes, riskZonesRes] = await Promise.all([
        Vehicles.getAll().catch(() => ({ data: [] })),
        Alerts.unresolved().catch(() => ({ data: [] })),
        Traffic.getAll().catch(() => ({ data: [] })),
        AI.riskZones().catch(() => ({ data: [] }))
      ]);

      setVehicles(vehiclesRes.data || []);
      setAlerts(alertsRes.data || []);
      setTraffic(trafficRes.data || []);
      setRiskZones(riskZonesRes.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === "ACTIVE").length,
    lowFuelVehicles: vehicles.filter(v => v.fuelLevel < 20).length,
    maintenanceVehicles: vehicles.filter(v => v.status === "MAINTENANCE").length,
    
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === "CRITICAL" || a.severity === "HIGH").length,
    
    totalTraffic: traffic.length,
    avgTrafficDensity: traffic.length > 0 
      ? (traffic.reduce((sum, t) => sum + (t.vehicleDensity || 0), 0) / traffic.length).toFixed(1)
      : 0,
    
    totalRiskZones: riskZones.length,
    highRiskZones: riskZones.filter(z => z.riskLevel === "HIGH" || z.riskLevel === "CRITICAL").length,
  };

  // Alert severity distribution
  const alertDistribution = [
    { name: "Critical", value: alerts.filter(a => a.severity === "CRITICAL").length, color: "#dc2626" },
    { name: "High", value: alerts.filter(a => a.severity === "HIGH").length, color: "#ea580c" },
    { name: "Medium", value: alerts.filter(a => a.severity === "MEDIUM").length, color: "#eab308" },
    { name: "Low", value: alerts.filter(a => a.severity === "LOW").length, color: "#22c55e" },
  ].filter(item => item.value > 0);

  // Vehicle status distribution
  const vehicleStatus = [
    { name: "Active", value: stats.activeVehicles, color: "#22c55e" },
    { name: "Maintenance", value: stats.maintenanceVehicles, color: "#eab308" },
    { name: "Inactive", value: vehicles.filter(v => v.status === "INACTIVE").length, color: "#dc2626" },
  ].filter(item => item.value > 0);

  // Traffic trend data (last 10)
  const trafficTrend = traffic.slice(-10).map(t => ({
    location: t.location?.substring(0, 15) + "...",
    density: t.vehicleDensity,
    speed: t.avgSpeed
  }));

  const getRiskColor = (level) => {
    switch (level) {
      case "CRITICAL": return "bg-red-100 text-red-700 border-red-300";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-300";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "CRITICAL": return "🔴";
      case "HIGH": return "🟠";
      case "MEDIUM": return "🟡";
      default: return "🟢";
    }
  };

  if (loading && vehicles.length === 0) {
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
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Fleet operations overview and insights</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-100 border-2 border-green-300 rounded-xl px-4 py-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-semibold text-sm">Live</span>
          </div>
          
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform">
              <Car className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{stats.totalVehicles}</p>
              <p className="text-xs opacity-90 mt-1">{stats.activeVehicles} Active</p>
            </div>
          </div>
          <p className="text-sm font-semibold opacity-90">Total Fleet</p>
        </div>

        <div className="group bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{stats.totalAlerts}</p>
              <p className="text-xs opacity-90 mt-1">{stats.criticalAlerts} Critical</p>
            </div>
          </div>
          <p className="text-sm font-semibold opacity-90">Active Alerts</p>
        </div>

        <div className="group bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform">
              <Navigation className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{stats.totalTraffic}</p>
              <p className="text-xs opacity-90 mt-1">Avg: {stats.avgTrafficDensity}</p>
            </div>
          </div>
          <p className="text-sm font-semibold opacity-90">Traffic Points</p>
        </div>

        <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{stats.totalRiskZones}</p>
              <p className="text-xs opacity-90 mt-1">{stats.highRiskZones} High Risk</p>
            </div>
          </div>
          <p className="text-sm font-semibold opacity-90">Risk Zones</p>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.activeVehicles}</p>
              <p className="text-xs text-gray-600 font-semibold">Active Fleet</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <Gauge className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{stats.maintenanceVehicles}</p>
              <p className="text-xs text-gray-600 font-semibold">Maintenance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <Fuel className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-700">{stats.lowFuelVehicles}</p>
              <p className="text-xs text-gray-600 font-semibold">Low Fuel</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-red-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.criticalAlerts}</p>
              <p className="text-xs text-gray-600 font-semibold">Critical</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.avgTrafficDensity}</p>
              <p className="text-xs text-gray-600 font-semibold">Avg Density</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-pink-600" />
            <div>
              <p className="text-2xl font-bold text-pink-700">{stats.highRiskZones}</p>
              <p className="text-xs text-gray-600 font-semibold">High Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Traffic Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Traffic Density Trend</h2>
              <p className="text-sm text-gray-500">Recent locations</p>
            </div>
          </div>

          {trafficTrend.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BarChart3 className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-lg">No traffic data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trafficTrend}>
                <XAxis 
                  dataKey="location" 
                  stroke="#6b7280" 
                  style={{ fontSize: '11px' }}
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
                <Bar dataKey="density" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alert Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Alert Distribution</h2>
              <p className="text-sm text-gray-500">By severity</p>
            </div>
          </div>

          {alertDistribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <CheckCircle className="w-16 h-16 mb-3 opacity-50 text-green-400" />
              <p className="text-lg text-green-600 font-semibold">No Active Alerts</p>
              <p className="text-sm">All systems operational</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Risk Zones Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Map className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">High Priority Risk Zones</h2>
              <p className="text-sm text-gray-500">Locations requiring attention</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {riskZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <MapPin className="w-16 h-16 mb-3 opacity-50" />
            <p className="text-lg">No risk zones detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskZones.slice(0, 6).map((z, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white to-gray-50 p-5 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-800">{z.location}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 flex items-center gap-1 ${getRiskColor(z.riskLevel)}`}>
                    {getRiskIcon(z.riskLevel)}
                    {z.riskLevel}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-semibold flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Density
                    </span>
                    <span className="font-bold text-gray-800">{z.density}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
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

                  {z.recommendedAction && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 font-semibold">
                        💡 {z.recommendedAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Navigation className="w-8 h-8" />
            </div>
              <Link to="/manager/traffic">
            <div>
              <h3 className="text-xl font-bold">Manage Traffic</h3>
              <p className="text-sm opacity-90">Add & monitor traffic data</p>
            </div>
              </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Go to Traffic Management</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Fleet Overview</h3>
              <p className="text-sm opacity-90">Monitor vehicle status</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">View Fleet Details</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Map className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Risk Zones Map</h3>
              <p className="text-sm opacity-90">Visual risk analysis</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Open Interactive Map</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;