import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Trips } from "../api/tripApi";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { MapPin, Plus, Edit2, Trash2, X, Navigation, Flag, Route, Clock, Search } from "lucide-react";

const emptyForm = {
  driverId: "",
  vehicleId: "",
  startLocation: "",
  endLocation: "",
  distance: "",
  status: "PENDING",

  startTime: "",
  endTime: "",
  eta: "",
};

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const formatIST = (time) => {
    if (!time) return "—";
    return time.replace("T", " ").substring(0, 16);
  };

  const loadTrips = async () => {
    try {
      const res = await Trips.getAll();
      setTrips(res.data || []);
    } catch {
      toast.error("❌ Error loading trips");
    }
  };

  const loadDrivers = async () => {
    try {
      const res = await api.get("/api/drivers");
      setDrivers(res.data || []);
    } catch {
      toast.error("❌ Failed to load drivers");
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await api.get("/api/vehicles");
      setVehicles(res.data || []);
    } catch {
      toast.error("❌ Failed to load vehicles");
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadTrips(), loadDrivers(), loadVehicles()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShow(true);
  };

  const openEdit = (t) => {
    setForm({
      driverId: String(t.driver?.driverId ?? ""),
      vehicleId: String(t.vehicle?.vehicleId ?? ""),

      startLocation: t.startLocation,
      endLocation: t.endLocation,
      distance: t.distance,
      status: t.status,

      startTime: t.startTime ?? "",
      endTime: t.endTime ?? "",
      eta: t.eta ?? "",
    });

    setEditingId(t.tripId);
    setShow(true);
  };

  const save = async (e) => {
    e.preventDefault();

    const payload = {
      driverId: Number(form.driverId),
      vehicleId: Number(form.vehicleId),

      startLocation: form.startLocation,
      endLocation: form.endLocation,
      distance: Number(form.distance),
      status: form.status,

      startTime: form.startTime || null,
      endTime: form.endTime || null,
      eta: form.eta || null,
    };

    try {
      if (!editingId) {
        await Trips.create(payload);
        toast.success("✅ Trip created successfully");
      } else {
        await Trips.update(editingId, payload);
        toast.success("✅ Trip updated successfully");
      }

      setShow(false);
      loadTrips();
    } catch (err) {
      toast.error(`❌ Error saving trip: ${err?.response?.data || "Unknown error"}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;

    try {
      await Trips.delete(id);
      toast.success("🗑️ Trip deleted");
      loadTrips();
    } catch {
      toast.error("❌ Error deleting trip");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ONGOING": return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const filteredTrips = trips.filter((t) =>
    (t.driver?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.vehicle?.registrationNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.startLocation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.endLocation || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* Header */}
      <div className="flex justify-between mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
          <Route className="w-8 h-8 mr-3 text-green-600" />
          Manage Trips
        </h2>

        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md hover:scale-105 transition"
          onClick={openCreate}
        >
          <Plus className="w-5 h-5 inline-block mr-2" />
          Add Trip
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by driver or location..."
          className="w-full pl-12 py-3 border rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Trip Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Driver</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Start</th>
              <th className="p-4">End</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">End Time</th>
              <th className="p-4">ETA</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrips.map((t) => (
              <tr key={t.tripId} className="border-t hover:bg-gray-50">
                <td className="p-4">{t.driver?.name}</td>
                <td className="p-4">{t.vehicle?.registrationNo}</td>
                <td className="p-4">{t.startLocation}</td>
                <td className="p-4">{t.endLocation}</td>

                <td className="p-4 text-gray-700">{formatIST(t.startTime)}</td>
                <td className="p-4 text-gray-700">{formatIST(t.endTime)}</td>
                <td className="p-4 text-gray-700">{formatIST(t.eta)}</td>

                <td className="p-4 space-x-2">
                  <button className="px-3 py-2 bg-yellow-500 text-white rounded-lg" onClick={() => openEdit(t)}>
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-red-600 text-white rounded-lg" onClick={() => handleDelete(t.tripId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">

            <h3 className="text-2xl font-bold mb-4">
              {editingId ? "Edit Trip" : "Add Trip"}
            </h3>

            <form onSubmit={save} className="space-y-4">

              {/* Driver */}
              <select
                className="w-full p-3 border rounded-xl"
                value={form.driverId}
                onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d.driverId} value={d.driverId}>{d.name}</option>
                ))}
              </select>

              {/* Vehicle */}
              <select
                className="w-full p-3 border rounded-xl"
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>{v.registrationNo}</option>
                ))}
              </select>

              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                placeholder="Start Location"
                value={form.startLocation}
                onChange={(e) => setForm({ ...form, startLocation: e.target.value })}
                required
              />

              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                placeholder="End Location"
                value={form.endLocation}
                onChange={(e) => setForm({ ...form, endLocation: e.target.value })}
                required
              />

              <input
                type="number"
                className="w-full p-3 border rounded-xl"
                placeholder="Distance (km)"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                required
              />

              {/* Start Time */}
              <div>
                <label className="font-semibold text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-xl"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>

              {/* End Time */}
              <div>
                <label className="font-semibold text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-xl"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>

              {/* ETA */}
              <div>
                <label className="font-semibold text-gray-700">ETA</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-xl"
                  value={form.eta}
                  onChange={(e) => setForm({ ...form, eta: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" className="px-6 py-3 bg-gray-200 rounded-xl" onClick={() => setShow(false)}>
                  Cancel
                </button>

                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                  {editingId ? "Update Trip" : "Create Trip"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ManageTrips;
