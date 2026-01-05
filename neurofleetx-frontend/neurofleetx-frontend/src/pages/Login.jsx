import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTruck, FaGoogle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

// Decode JWT helper
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    /* Google Button Init - Hidden */
    window.google?.accounts.id.initialize({
      client_id: "596400670062-ge2o9okc7afst4r103nsss0lkvfiglgn.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    // Render hidden button for triggering
    window.google?.accounts.id.renderButton(
      document.getElementById("hiddenGoogleButton"),
      {
        theme: "filled_blue",
        size: "large",
      }
    );
  }, []);

  // Google Response Handler
  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Google Login Failed!", {
          icon: "🚫",
          style: { borderRadius: "10px", background: "#333", color: "#fff" }
        });
        setGoogleLoading(false);
        return;
      }

      login({ token: data.token, role: data.role });

      toast.success("Google Login Successful! 🎉", {
        style: { borderRadius: "10px", background: "#10b981", color: "#fff" }
      });

      setTimeout(() => {
        switch (data.role) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "MANAGER":
            navigate("/manager");
            break;
          case "DRIVER":
            navigate("/driver");
            break;
          default:
            navigate("/");
        }
      }, 1000);
    } catch (err) {
      toast.error("Google Auth Error! 🔧");
      console.error(err);
      setGoogleLoading(false);
    }
  };

  // Trigger hidden Google button
  const handleGoogleClick = () => {
    setGoogleLoading(true);
    const hiddenButton = document.querySelector("#hiddenGoogleButton div[role='button']");
    if (hiddenButton) {
      hiddenButton.click();
    } else {
      // Fallback to prompt
      window.google?.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false);
        }
      });
    }
  };

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (response.ok) {
        const parsed = JSON.parse(responseText);
        login({ token: parsed.token, role: parsed.role });

        toast.success("Login Successful! 🚀", {
          style: { borderRadius: "10px", background: "#10b981", color: "#fff" }
        });

        setTimeout(() => {
          switch (parsed.role) {
            case "ADMIN":
              navigate("/admin");
              break;
            case "MANAGER":
              navigate("/manager");
              break;
            case "DRIVER":
              navigate("/driver");
              break;
            default:
              navigate("/");
          }
        }, 1000);
      } else {
        toast.error("Invalid Credentials! ❌");
      }
    } catch (err) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Hidden Google Button */}
      <div id="hiddenGoogleButton" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <FaTruck className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
              NeuroFleetX
              <HiSparkles className="text-yellow-400 text-2xl" />
            </h1>
            <p className="text-gray-600 text-sm">Smart Fleet Management System</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                />
                <span className="ml-2 text-gray-700 group-hover:text-indigo-600 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Forgot password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">or</span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Custom Google Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleClick}
            disabled={googleLoading}
            type="button"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            {/* Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-red-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="relative z-10">Connecting...</span>
              </>
            ) : (
              <>
                {/* Google Icon with Gradient */}
                <div className="relative z-10 w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6 10.2273C19.6 9.51825 19.5364 8.83643 19.4182 8.18188H10V12.0501H15.3818C15.15 13.3001 14.4455 14.3592 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2728 19.6 10.2273Z" fill="#4285F4"/>
                    <path d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z" fill="#34A853"/>
                    <path d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z" fill="#FBBC04"/>
                    <path d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="relative z-10 font-semibold">Continue with Google</span>
              </>
            )}
          </motion.button>

          {/* Register Link */}
          <motion.p 
            variants={itemVariants}
            className="text-center mt-6 text-gray-600"
          >
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              Create Account
            </Link>
          </motion.p>
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

export default Login;