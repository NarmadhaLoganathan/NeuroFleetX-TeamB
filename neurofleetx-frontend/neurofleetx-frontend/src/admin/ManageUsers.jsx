import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Users } from "../api/userApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaTrash, 
  FaUserShield, 
  FaUserTie, 
  FaUserPlus,
  FaTruck,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await Users.getAll();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users. Are you Admin? ⚠️");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if(!confirm("Are you sure? This cannot be undone.")) return;
    setDeleteLoading(id);
    try {
      await Users.delete(id);
      toast.success("User deleted successfully! 🗑️", {
        style: { borderRadius: "10px", background: "#10b981", color: "#fff" }
      });
      loadUsers();
    } catch (err) {
      toast.error("Failed to delete user ❌");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch(role) {
      case "ADMIN": return <FaUserShield className="text-red-600" />;
      case "MANAGER": return <FaUserTie className="text-purple-600" />;
      case "DRIVER": return <FaTruck className="text-blue-600" />;
      default: return <FaUsers className="text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case "ADMIN": return "bg-red-100 text-red-700 border-red-200";
      case "MANAGER": return "bg-purple-100 text-purple-700 border-purple-200";
      case "DRIVER": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <MdAdminPanelSettings className="text-purple-600" />
              User Management
            </h1>
            <p className="text-gray-600 text-lg">Manage Admins, Managers, and Drivers</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 group"
            >
              <FaUserPlus className="group-hover:scale-110 transition-transform" />
              Add Admin/Manager
            </Link>
            <Link 
              to="/admin/drivers" 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 group"
            >
              <FaTruck className="group-hover:scale-110 transition-transform" />
              Manage Drivers
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<FaUsers />}
            title="Total Users"
            value={users.length}
            gradient="from-indigo-500 to-purple-600"
          />
          <StatCard 
            icon={<FaUserShield />}
            title="Admins"
            value={users.filter(u => u.role === 'ADMIN').length}
            gradient="from-red-500 to-pink-600"
          />
          <StatCard 
            icon={<FaUserTie />}
            title="Managers"
            value={users.filter(u => u.role === 'MANAGER').length}
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard 
            icon={<FaTruck />}
            title="Drivers"
            value={users.filter(u => u.role === 'DRIVER').length}
            gradient="from-blue-500 to-cyan-600"
          />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="DRIVER">Driver</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            <span className="font-medium">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <tr>
                  <th className="p-4 font-bold text-gray-700">ID</th>
                  <th className="p-4 font-bold text-gray-700">User</th>
                  <th className="p-4 font-bold text-gray-700">Email</th>
                  <th className="p-4 font-bold text-gray-700">Role</th>
                  <th className="p-4 font-bold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FaUsers className="text-6xl text-gray-300" />
                        <p className="text-gray-500 font-semibold">No users found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-purple-50/50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <span className="text-gray-500 font-semibold">#{u.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(u.role)}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          {u.role !== 'ADMIN' ? (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteUser(u.id)}
                              disabled={deleteLoading === u.id}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                              title="Delete User"
                            >
                              {deleteLoading === u.id ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <FaTrash className="group-hover:scale-110 transition-transform" />
                              )}
                            </motion.button>
                          ) : (
                            <span className="text-gray-400 text-xs font-semibold px-3 py-1 bg-gray-100 rounded-full">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

// Stats Card Component
const StatCard = ({ icon, title, value, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer group"
  >
    <div className="flex items-center justify-between">
      <div className={`p-4 bg-gradient-to-br ${gradient} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 text-white text-2xl`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {value}
        </h3>
      </div>
    </div>
  </motion.div>
);

export default ManageUsers;