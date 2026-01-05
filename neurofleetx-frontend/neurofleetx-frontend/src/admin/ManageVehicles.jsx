import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Vehicles } from "../api/vehicleApi";
import { Drivers } from "../api/driverApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Car, Plus, Edit2, Trash2, X, Fuel, Gauge, Search } from "lucide-react";

const emptyForm = {
  registrationNo: "",
  vehicleType: "",
  fuelType: "DIESEL",
  status: "ACTIVE",
  fuelLevel: 0,
  totalDistance: 0,
  driverId: ""
};

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await Vehicles.getAll();
      setVehicles(res.data);
    } catch (e) {
      toast.error("❌ Failed to load vehicles", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await Drivers.getAll();
      setDrivers(res.data);
    } catch (e) {
      console.error("Failed to load drivers", e);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchDrivers();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (v) => {
    setForm({
      registrationNo: v.registrationNo,
      vehicleType: v.vehicleType,
      fuelType: v.fuelType,
      status: v.status,
      fuelLevel: v.fuelLevel,
      totalDistance: v.totalDistance,
      driverId: v.driverId || ""
    });
    setEditingId(v.vehicleId);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await Vehicles.delete(id);
      toast.success("✅ Vehicle deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      fetchAll();
    } catch {
      toast.error("❌ Delete failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await Vehicles.update(editingId, form);
        toast.success("✅ Vehicle updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await Vehicles.create(form);
        toast.success("✅ Vehicle created successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error("❌ Save failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getFuelColor = (level) => {
    if (level >= 70) return "text-green-600";
    if (level >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700";
      case "IDLE": return "bg-yellow-100 text-yellow-700";
      case "STUCK": return "bg-red-100 text-red-700";
      case "MAINTENANCE": return "bg-gray-100 text-gray-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.fuelType?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
            <Car className="w-8 h-8 mr-3 text-blue-600" />
            Manage Vehicles
          </h2>
          <p className="text-gray-600 mt-2">Add, edit, and monitor your fleet</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vehicles by registration, type, or fuel..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fuel Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fuel Level</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total Distance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Car className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">No vehicles found</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(v => (
                  <tr key={v.vehicleId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          <Car className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-800">{v.registrationNo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        {v.vehicleType || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {v.fuelType}
                      </span>
                    </td>
                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Fuel className={`w-4 h-4 mr-2 ${getFuelColor(v.fuelLevel)}`} />
                        <span className={`font-semibold ${getFuelColor(v.fuelLevel)}`}>
                          {v.fuelLevel}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-700">
                        <Gauge className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-semibold">{v.totalDistance} km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.vehicleId)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                {editingId ? <Edit2 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Registration Number *</label>
                <input
                  required
                  value={form.registrationNo}
                  onChange={e => setForm({ ...form, registrationNo: e.target.value })}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="e.g. ABC-1234"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Vehicle Type</label>
                  <input
                    value={form.vehicleType}
                    onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="e.g. Truck, Van"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Fuel Type *</label>
                  <select
                    value={form.fuelType}
                    onChange={e => setForm({ ...form, fuelType: e.target.value })}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  >
                    <option>DIESEL</option>
                    <option>PETROL</option>
                    <option>EV</option>
                  </select>
                </div>
              </div>

              {/* Updated Status Dropdown */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Status *</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 transition-all"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="IDLE">IDLE</option>
                  <option value="STUCK">STUCK / JAMMED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Assign Driver</label>
                <select
                  value={form.driverId}
                  onChange={e => setForm({ ...form, driverId: e.target.value })}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 transition-all"
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map(d => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.name} ({d.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Fuel Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.fuelLevel}
                    onChange={e => setForm({ ...form, fuelLevel: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Total Distance (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.totalDistance}
                    onChange={e => setForm({ ...form, totalDistance: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {editingId ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageVehicles;