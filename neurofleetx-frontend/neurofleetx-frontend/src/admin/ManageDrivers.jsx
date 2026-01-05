import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Drivers } from "../api/driverApi";
import { toast } from "react-toastify";
import { Users, Plus, Edit2, Trash2, X, Mail, Phone, Award, IdCard, Search } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  licenseNo: "",
  phone: "",
  experienceYears: "",
};

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const res = await Drivers.getAll();
      setDrivers(res.data);
    } catch {
      toast.error("❌ Failed to load drivers", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShow(true);
  };

  const openEdit = (d) => {
    setForm({
      name: d.name,
      email: d.email,
      licenseNo: d.licenseNo,
      phone: d.phone,
      experienceYears: d.experienceYears,
      password: "",
    });
    setEditingId(d.driverId);
    setShow(true);
  };

  const deleteDriver = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      await Drivers.update(id, { archived: true });
      toast.success("✅ Driver deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      loadDrivers();
    } catch {
      toast.error("❌ Failed to delete driver", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await Drivers.update(editingId, form);
        toast.success("✅ Driver updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await Drivers.create(form);
        toast.success("✅ Driver created successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setShow(false);
      loadDrivers();
    } catch {
      toast.error("❌ Saving failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenseNo?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center">
            <Users className="w-8 h-8 mr-3 text-purple-600" />
            Manage Drivers
          </h2>
          <p className="text-gray-600 mt-2">Add, edit, and manage driver information</p>
        </div>

        <button 
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold" 
          onClick={openCreate}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search drivers by name, email, or license..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">License</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">No drivers found</p>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((d) => (
                  <tr key={d.driverId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {d.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {d.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-700">
                        <IdCard className="w-4 h-4 mr-2 text-gray-400" />
                        {d.licenseNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {d.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
                        <Award className="w-4 h-4 mr-1" />
                        {d.experienceYears} years
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteDriver(d.driverId)}
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
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-2xl font-bold text-white flex items-center">
                {editingId ? <Edit2 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                {editingId ? "Edit Driver" : "Add Driver"}
              </h3>
              <button
                onClick={() => setShow(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name *</label>
                <input 
                  required 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300" 
                  placeholder="John Doe"
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
              </div>

              {!editingId && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address *</label>
                    <input 
                      required 
                      type="email"
                      placeholder="john@example.com" 
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Password *</label>
                    <input 
                      required 
                      type="password" 
                      placeholder="Enter secure password"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </>
              )}

              {editingId && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
                  <input 
                    disabled 
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-100 cursor-not-allowed"
                    value={form.email} 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">License Number *</label>
                <input 
                  required 
                  placeholder="DL-1234567890" 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  value={form.licenseNo} 
                  onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number *</label>
                <input 
                  required 
                  placeholder="+1 234 567 8900" 
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience (Years)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300" 
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
                  {editingId ? "Update Driver" : "Create Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageDrivers;