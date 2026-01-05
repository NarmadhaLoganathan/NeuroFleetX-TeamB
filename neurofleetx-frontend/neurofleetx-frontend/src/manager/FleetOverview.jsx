import Layout from "../components/Layout";
import { Vehicles } from "../api/vehicleApi";
import { useEffect, useState } from "react";
import { 
  Car, Fuel, AlertTriangle, Wrench, TrendingUp, 
  Activity, RefreshCw, Search, Filter, Gauge,
  CheckCircle, XCircle, Clock, Zap, BarChart3,
  Navigation, MapPin
} from "lucide-react";

const FleetOverview = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("registrationNo");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await Vehicles.getAll();
      setVehicles(res.data || []);
    } catch (error) {
      console.error("Failed to load vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "ACTIVE").length,
    lowFuel: vehicles.filter(v => v.fuelLevel < 20).length,
    maintenance: vehicles.filter(v => v.status === "MAINTENANCE").length,
    inactive: vehicles.filter(v => v.status === "INACTIVE").length,
    avgFuel: vehicles.length > 0 
      ? (vehicles.reduce((sum, v) => sum + (v.fuelLevel || 0), 0) / vehicles.length).toFixed(1)
      : 0,
    totalDistance: vehicles.reduce((sum, v) => sum + (v.totalDistance || 0), 0),
  };

  // Filter and search vehicles
  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = 
        v.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "ALL" || v.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "registrationNo") return a.registrationNo?.localeCompare(b.registrationNo);
      if (sortBy === "fuelLevel") return (b.fuelLevel || 0) - (a.fuelLevel || 0);
      if (sortBy === "totalDistance") return (b.totalDistance || 0) - (a.totalDistance || 0);
      return 0;
    });

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-300";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "INACTIVE":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "MAINTENANCE":
        return <Wrench className="w-4 h-4" />;
      case "INACTIVE":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Get fuel level color
  const getFuelColor = (level) => {
    if (level >= 70) return "text-green-600";
    if (level >= 40) return "text-yellow-600";
    if (level >= 20) return "text-orange-600";
    return "text-red-600";
  };

  // Get fuel icon
  const getFuelIcon = (level) => {
    if (level >= 70) return "🟢";
    if (level >= 40) return "🟡";
    if (level >= 20) return "🟠";
    return "🔴";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Car className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
            <Car className="w-8 h-8 mr-3 text-blue-600" />
            Fleet Overview
          </h1>
          <p className="text-gray-600 mt-2">Monitor and manage your entire vehicle fleet</p>
        </div>

        <button
          onClick={loadVehicles}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="col-span-2 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Car className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Total Fleet</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.active}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Active</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Fuel className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.lowFuel}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Low Fuel</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Wrench className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.maintenance}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Maintenance</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <XCircle className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.inactive}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Inactive</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Gauge className="w-7 h-7" />
            <span className="text-3xl font-bold">{stats.avgFuel}%</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Avg Fuel</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 shadow-lg text-white hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <Navigation className="w-7 h-7" />
            <span className="text-2xl font-bold">{(stats.totalDistance / 1000).toFixed(1)}k</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Total KM</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by registration or type..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex items-center bg-white rounded-xl shadow-md p-2 gap-2 border-2 border-gray-200">
            <Filter className="w-5 h-5 text-gray-600 ml-2" />
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterStatus === "ALL" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("ACTIVE")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterStatus === "ACTIVE" 
                  ? "bg-green-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus("MAINTENANCE")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterStatus === "MAINTENANCE" 
                  ? "bg-yellow-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Maintenance
            </button>
            <button
              onClick={() => setFilterStatus("INACTIVE")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterStatus === "INACTIVE" 
                  ? "bg-red-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="flex items-center bg-white rounded-xl shadow-md p-2 gap-2 border-2 border-gray-200">
            <BarChart3 className="w-5 h-5 text-gray-600 ml-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 border-none focus:outline-none cursor-pointer"
            >
              <option value="registrationNo">Registration</option>
              <option value="fuelLevel">Fuel Level</option>
              <option value="totalDistance">Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
            <Car className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No vehicles found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredVehicles.map((v) => (
            <div
              key={v.vehicleId}
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{v.registrationNo}</h3>
                      <p className="text-xs opacity-90">{v.vehicleType || "Standard Vehicle"}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1 ${getStatusBadge(v.status)}`}>
                    {getStatusIcon(v.status)}
                    {v.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Fuel Level */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      Fuel Level
                    </span>
                    <span className={`text-xl font-bold flex items-center gap-1 ${getFuelColor(v.fuelLevel)}`}>
                      {getFuelIcon(v.fuelLevel)}
                      {v.fuelLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        v.fuelLevel >= 70 ? "bg-gradient-to-r from-green-400 to-green-600" :
                        v.fuelLevel >= 40 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                        v.fuelLevel >= 20 ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                        "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      style={{ width: `${v.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600 font-semibold">Distance</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{v.totalDistance || 0} km</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-600 font-semibold">Fuel Type</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700">{v.fuelType || "DIESEL"}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" />
                    Details
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Track
                  </button>
                </div>
              </div>

              {/* Footer Badge */}
              {v.fuelLevel < 20 && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  LOW FUEL - REFUEL REQUIRED
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Fleet Summary</h3>
            <p className="text-blue-800 text-sm">
              Showing <strong>{filteredVehicles.length}</strong> of <strong>{vehicles.length}</strong> vehicles. 
              Average fuel level: <strong>{stats.avgFuel}%</strong>. 
              Total fleet distance: <strong>{stats.totalDistance.toLocaleString()} km</strong>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FleetOverview;