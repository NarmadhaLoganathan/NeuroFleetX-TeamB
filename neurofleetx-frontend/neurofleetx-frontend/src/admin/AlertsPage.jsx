import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Alerts } from "../api/alertApi";
import { toast } from "react-toastify";
import { AlertTriangle, Plus, X, CheckCircle, Clock, Filter, Search } from "lucide-react";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    alertType: "",
    severity: "",
    description: "",
    vehicleId: ""
  });

  const loadAlerts = async () => {
    try {
      const res = await Alerts.getAll();
      setAlerts(res.data);
      setLoading(false);
    } catch {
      toast.error("Error loading alerts", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  const resolve = async (id) => {
    try {
      await Alerts.resolve(id);
      toast.success("✅ Alert resolved successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      loadAlerts();
    } catch {
      toast.error("❌ Failed resolving alert", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const createAlert = async () => {
    if (!form.alertType || !form.severity || !form.description) {
      toast.error("⚠️ Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await Alerts.create(form);
      toast.success("✅ Alert created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setShowModal(false);
      setForm({ alertType: "", severity: "", description: "", vehicleId: "" });
      loadAlerts();
    } catch (e) {
      toast.error("❌ Error creating alert", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const severityColor = (sev) => {
    switch (sev) {
      case "HIGH":
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.alertType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vehicle?.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
            Traffic Alerts
          </h2>
          <p className="text-gray-600 mt-2">Monitor and manage system alerts</p>
        </div>

        <button
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Alert
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search alerts by type, description, or vehicle..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ALERT LIST */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">No alerts found</p>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.alertId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-700">#{a.alertId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        {a.alertType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border-2 ${severityColor(a.severity)}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 max-w-xs truncate">{a.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700 font-medium">{a.vehicle?.registrationNo || "—"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.isResolved ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolved
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-600 font-medium">
                          <Clock className="w-4 h-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!a.isResolved && (
                        <button
                          onClick={() => resolve(a.alertId)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FOR ADD ALERT */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Plus className="w-6 h-6 mr-2" />
                Create Alert
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Alert Type */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Alert Type *</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="e.g. CONGESTION, ACCIDENT, OVERSPEED"
                  value={form.alertType}
                  onChange={(e) => setForm({ ...form, alertType: e.target.value })}
                />
              </div>

              {/* Severity */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Severity *</label>
                <select
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                >
                  <option value="">Select Severity</option>
                  <option value="LOW">🟢 LOW</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="CRITICAL">🔴 CRITICAL</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Description *</label>
                <textarea
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                  rows="4"
                  placeholder="Describe the alert details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                ></textarea>
              </div>

              {/* Vehicle (Optional) */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Vehicle ID (Optional)</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="e.g. 12"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={createAlert}
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AlertsPage;