import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdPassword } from "react-icons/md";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      alert('Please initiate password reset from the "Forgot Password" page.');
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirm password do not match.");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(
        email,
        otpCode,
        newPassword
      );
      setMessage(response);
      setIsError(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error || "Failed to reset password. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-600 to-red-600 rounded-2xl shadow-lg mb-4">
              <MdPassword className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
              Reset Password
              <HiSparkles className="text-yellow-400 text-2xl" />
            </h1>
            <p className="text-gray-600 text-sm">Enter OTP and create new password</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  readOnly={!!location.state?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 ${
                    location.state?.email ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            {/* OTP Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code (OTP)
              </label>
              <div className="relative group">
                <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-center text-2xl tracking-widest font-bold"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>
            </motion.div>

            {/* New Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">Must be at least 6 characters</p>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative group">
                <FaCheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-rose-600 focus:ring-4 focus:ring-rose-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                <>
                  <MdPassword />
                  Reset Password
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

          {/* Alert */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
                isError
                  ? "bg-red-50 border-2 border-red-200 text-red-700"
                  : "bg-green-50 border-2 border-green-200 text-green-700"
              }`}
            >
              {isError ? (
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <FaCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{isError ? "Error" : "Success"}</p>
                <p className="mt-1">{message}</p>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div variants={itemVariants} className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Security Tips</p>
                <p>Choose a strong password with at least 6 characters. The OTP is valid for 10 minutes.</p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">or</span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Back to Login */}
          <motion.div variants={itemVariants}>
            <Link
              to="/login"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
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

export default ResetPassword;