import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaUserTie, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdAdminPanelSettings } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jwtToken");
    if (!stored) {
      toast.error("Only admin can access this page! 🔒");
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "ADMIN") {
      toast.error("Only admin can create accounts! ⚠️");
      navigate("/");
      return;
    }
    setToken(parsed.token);
  }, [navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("User created successfully! 🎉", {
          style: { borderRadius: "10px", background: "#10b981", color: "#fff" }
        });
        setTimeout(() => navigate("/admin/users"), 1500);
      } else {
        const errorText = await res.text();
        toast.error(errorText || "Failed to create user! ❌");
      }
    } catch (error) {
      toast.error("Server Error! 🔧");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const getRoleIcon = () => {
    if (data.role === "ADMIN") return <FaUserShield className="text-purple-600" />;
    if (data.role === "MANAGER") return <FaUserTie className="text-blue-600" />;
    return <FaUser className="text-gray-400" />;
  };

  const getRoleBadgeColor = () => {
    if (data.role === "ADMIN") return "from-purple-50 to-pink-50 border-purple-200";
    if (data.role === "MANAGER") return "from-blue-50 to-cyan-50 border-blue-200";
    return "from-gray-50 to-gray-100 border-gray-200";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-4 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 240],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [240, 120, 0],
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, -60, 0],
            x: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
          {/* Logo & Header */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4">
              <MdAdminPanelSettings className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
              Create User
              <HiSparkles className="text-yellow-400 text-2xl" />
            </h1>
            <p className="text-gray-600 text-sm">Admin Panel - User Management</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={register} className="space-y-5">
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Role *
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  {getRoleIcon()}
                </div>
                <select
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  name="role"
                  value={data.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Role Preview Badge */}
            {data.role && (
              <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={`bg-gradient-to-r ${getRoleBadgeColor()} border-2 rounded-xl p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      data.role === "ADMIN" ? "bg-gradient-to-br from-purple-600 to-pink-600" :
                      data.role === "MANAGER" ? "bg-gradient-to-br from-blue-600 to-cyan-600" :
                      "bg-gray-500"
                    }`}>
                      {data.role === "ADMIN" ? <FaUserShield className="text-white text-lg" /> :
                       data.role === "MANAGER" ? <FaUserTie className="text-white text-lg" /> :
                       <FaUser className="text-white text-lg" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Creating user as</p>
                      <p className={`text-lg font-bold ${
                        data.role === "ADMIN" ? "text-purple-600" :
                        data.role === "MANAGER" ? "text-blue-600" :
                        "text-gray-600"
                      }`}>
                        {data.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating User...
                </>
              ) : (
                <>
                  <MdAdminPanelSettings size={20} />
                  Create User
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Back Button */}
          <motion.div variants={itemVariants} className="mt-6">
            <Link
              to="/admin/users"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to User Management
            </Link>
          </motion.div>
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-white/80 text-sm"
        >
          © 2024 NeuroFleetX. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;