import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Traffic } from "../api/trafficApi";
import { toast } from "react-toastify";
import { 
  MapPin, Plus, Edit2, Trash2, X, Activity, 
  TrendingUp, Clock, Search, AlertTriangle,
  RefreshCw, BarChart3, Navigation
} from "lucide-react";

const TrafficManagement = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    location: "",
    vehicleDensity: "",
    avgSpeed: ""
  });

  const loadTrafficData = async () => {
    try {
      setLoading(true);
      const res = await Traffic.getAll();
      setTrafficData(res.data || []);
    } catch (error) {
      toast.error("❌ Failed to load traffic data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrafficData();
    const interval = setInterval(loadTrafficData, 30000);
    return () => clearInterval(interval);
  }, []);

  const openCreate = () => {
    setForm({ location: "", vehicleDensity: "", avgSpeed: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (data) => {
    setForm({
      location: data.location,
      vehicleDensity: data.vehicleDensity,
      avgSpeed: data.avgSpeed
    });
    setEditingId(data.trafficId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.location.trim()) {
      toast.error("⚠️ Please enter a location", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        await Traffic.update(editingId, {
          vehicleDensity: parseInt(form.vehicleDensity),
          avgSpeed: parseFloat(form.avgSpeed)
        });
        toast.success("✅ Traffic data updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await Traffic.createByLocation({
          location: form.location,
          vehicleDensity: parseInt(form.vehicleDensity),
          avgSpeed: parseFloat(form.avgSpeed)
        });
        toast.success("✅ Traffic data created successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
      setShowModal(false);
      loadTrafficData();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save traffic data";
      toast.error(`❌ ${errorMsg}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this traffic record?")) return;

    try {
      await Traffic.delete(id);
      toast.success("✅ Traffic data deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      loadTrafficData();
    } catch (error) {
      toast.error("❌ Failed to delete traffic data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getCongestionColor = (level) => {
    switch (level) {
      case "CRITICAL": return "bg-red-100 text-red-700 border-red-300";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-300";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const getCongestionIcon = (level) => {
    switch (level) {
      case "CRITICAL": return "🔴";
      case "HIGH": return "🟠";
      case "MEDIUM": return "🟡";
      default: return "🟢";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredData = trafficData.filter(t =>
    t.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: trafficData.length,
    critical: trafficData.filter(t => t.congestionLevel === "CRITICAL").length,
    high: trafficData.filter(t => t.congestionLevel === "HIGH").length,
    medium: trafficData.filter(t => t.congestionLevel === "MEDIUM").length,
    low: trafficData.filter(t => t.congestionLevel === "LOW").length,
  };

  if (loading) {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
            <Navigation className="w-8 h-8 mr-3 text-orange-600" />
            Traffic Management
          </h2>
          <p className="text-gray-600 mt-2">Monitor and manage real-time traffic data</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadTrafficData}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={openCreate}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Traffic Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 font-semibold">Total Locations</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔴</span>
            <span className="text-2xl font-bold">{stats.critical}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Critical</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🟠</span>
            <span className="text-2xl font-bold">{stats.high}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">High</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🟡</span>
            <span className="text-2xl font-bold">{stats.medium}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Medium</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🟢</span>
            <span className="text-2xl font-bold">{stats.low}</span>
          </div>
          <p className="text-sm font-semibold opacity-90">Low</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Coordinates</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vehicle Density</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Avg Speed</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Congestion</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">No traffic data found</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((data) => (
                  <tr key={data.trafficId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-semibold text-gray-800">{data.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-semibold text-gray-700">{data.vehicleDensity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-semibold text-gray-700">{data.avgSpeed} km/h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold border-2 ${getCongestionColor(data.congestionLevel)} flex items-center gap-2 w-fit`}>
                        <span>{getCongestionIcon(data.congestionLevel)}</span>
                        {data.congestionLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(data.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(data)}
                          className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(data.trafficId)}
                          className="flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                {editingId ? <Edit2 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                {editingId ? "Update Traffic Data" : "Add Traffic Data"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Location Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    disabled={editingId ? true : false}
                    className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${editingId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="e.g., Times Square, New York"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                {editingId && (
                  <p className="text-xs text-gray-500 mt-1">Location cannot be changed when editing</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Vehicle Density (0-100) *
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="e.g., 75"
                      value={form.vehicleDensity}
                      onChange={(e) => setForm({ ...form, vehicleDensity: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    0-29: Low | 30-59: Medium | 60-79: High | 80+: Critical
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Average Speed (km/h) *
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="e.g., 45.5"
                      value={form.avgSpeed}
                      onChange={(e) => setForm({ ...form, avgSpeed: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The location will be automatically converted to coordinates (latitude/longitude) 
                  and congestion level will be calculated based on vehicle density.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {editingId ? "Update Data" : "Add Data"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TrafficManagement;