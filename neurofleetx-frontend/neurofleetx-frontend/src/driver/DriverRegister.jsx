import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaTruck, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdDirectionsCar } from "react-icons/md";

const DriverRegister = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DRIVER",
    licenseNumber: "",
    phoneNumber: "",
    experienceYears: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Driver registered successfully! 🎉", {
          style: { borderRadius: "10px", background: "#10b981", color: "#fff" },
        });
        setTimeout(() => Navigate("/login"), 1500);
      } else {
        const errorText = await res.text();
        toast.error(errorText || "Registration failed! ❌");
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 p-4 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [180, 90, 0] }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ y: [0, -60, 0], x: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">

          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-4">
              <MdDirectionsCar className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
              Driver Registration <HiSparkles className="text-yellow-400 text-2xl" />
            </h1>
            <p className="text-gray-600 text-sm">Join our fleet management system</p>
          </motion.div>

          {/* FORM */}
          <form onSubmit={register} className="space-y-5">

            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-600 focus:ring-4"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* License Number */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">License Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={data.licenseNumber}
                onChange={handleChange}
                placeholder="TN-75-2024-XXXX"
                className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50"
                required
              />
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="text"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50"
                required
              />
            </motion.div>

            {/* Experience Years */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years) *</label>
              <input
                type="number"
                name="experienceYears"
                value={data.experienceYears}
                onChange={handleChange}
                placeholder="5"
                className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50"
                required
              />
            </motion.div>

            {/* Role Information Box */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FaTruck className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Registering as</p>
                  <p className="text-lg font-bold text-blue-600">Driver</p>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3.5 rounded-xl shadow-lg"
            >
              {isLoading ? "Registering..." : "Register as Driver →"}
            </motion.button>
          </form>

          {/* Bottom Links */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Already registered?</span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          <Link
            to="/login"
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl shadow-md flex justify-center"
          >
            Back to Login →
          </Link>
        </div>

        <p className="text-center mt-6 text-white/80 text-sm">
          © 2024 NeuroFleetX. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default DriverRegister;
