import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShieldAlt, FaSignOutAlt, FaBell, FaTimes, FaBars } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useState } from "react";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "from-purple-500 to-pink-600";
      case "MANAGER": return "from-blue-500 to-cyan-600";
      case "DRIVER": return "from-green-500 to-teal-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return "👑";
      case "MANAGER": return "💼";
      case "DRIVER": return "🚗";
      default: return "👤";
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="lg:ml-64 h-16 bg-white/95 backdrop-blur-2xl shadow-lg border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 lg:left-64 z-40"
      >
        {/* Animated gradient line at top */}
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />

        {/* Left Side */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaBars className="w-6 h-6 text-gray-700" />
          </motion.button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="min-w-0"
          >
            <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2 truncate">
              <span className="text-xl sm:text-2xl">{getRoleIcon(auth?.role)}</span>
              <span className="hidden sm:inline">{auth?.role ?? "User"} Dashboard</span>
              <span className="sm:hidden">{auth?.role ?? "User"}</span>
              <motion.span
                animate={{ 
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <HiSparkles className="text-yellow-400 text-base sm:text-lg" />
              </motion.span>
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:block">Welcome back to NeuroFleetX</p>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <FaBell className="text-gray-600 group-hover:text-gray-800 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
              
              {/* Notification Badge */}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-lg"
              >
                3
              </motion.span>

              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-400 rounded-xl"
              />
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop for mobile */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-4 sm:p-5 relative overflow-hidden">
                      <motion.div
                        animate={{ x: [0, 100, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20"
                      />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                            <FaBell />
                            Notifications
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-100 mt-1">You have 3 new notifications</p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowNotifications(false)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors lg:hidden"
                        >
                          <FaTimes className="text-white w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                            >
                              <FaBell className="text-white text-sm" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">New Alert #{i}</p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">Vehicle status update received</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <p className="text-xs text-gray-400">2 minutes ago</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div 
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="p-3 sm:p-4 bg-gray-50 text-center border-t border-gray-200"
                    >
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto">
                        View All Notifications
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* User Info Card - Hidden on small mobile */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getRoleBadgeColor(auth?.role)} rounded-full flex items-center justify-center shadow-lg relative`}
            >
              {/* Glow effect */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 bg-gradient-to-br ${getRoleBadgeColor(auth?.role)} rounded-full blur-md`}
              />
              <FaUser className="text-white text-xs sm:text-sm relative z-10" />
            </motion.div>

            <div className="text-xs sm:text-sm min-w-0">
              <p className="font-bold text-gray-800 leading-tight truncate max-w-[100px] sm:max-w-[150px]">
                {auth?.email?.split('@')[0] || "User"}
              </p>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r ${getRoleBadgeColor(auth?.role)} shadow-sm mt-1`}>
                <FaShieldAlt className="mr-1 text-[8px] sm:text-xs" />
                {auth?.role}
              </div>
            </div>
          </motion.div>

          {/* Mobile User Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`sm:hidden w-9 h-9 bg-gradient-to-br ${getRoleBadgeColor(auth?.role)} rounded-full flex items-center justify-center shadow-lg relative`}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 bg-gradient-to-br ${getRoleBadgeColor(auth?.role)} rounded-full blur-md`}
            />
            <FaUser className="text-white text-xs relative z-10" />
          </motion.div>

          {/* Logout Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
            <span className="hidden sm:inline relative z-10">Logout</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 h-full bg-white shadow-2xl"
            >
              {/* Mobile menu content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
                  </motion.button>
                </div>
                
                {/* User info in mobile menu */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRoleBadgeColor(auth?.role)} rounded-full flex items-center justify-center shadow-lg`}>
                      <FaUser className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">
                        {auth?.email?.split('@')[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{auth?.email}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getRoleBadgeColor(auth?.role)} shadow-sm w-full justify-center`}>
                    <FaShieldAlt className="mr-1.5" />
                    {auth?.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;