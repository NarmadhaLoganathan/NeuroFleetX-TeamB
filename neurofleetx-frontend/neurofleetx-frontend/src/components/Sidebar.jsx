import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaCar,
  FaMapMarkedAlt,
  FaRoute,
  FaTachometerAlt,
  FaBell,
  FaClipboardList,
  FaChartBar,
  FaRobot,
  FaTruck,
  FaExclamationTriangle,
  FaUserPlus,
  FaBolt,
  FaGlobe,
  FaCompass,
  FaChartLine,
  FaUserCog
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Sidebar = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const menuByRole = {
    ADMIN: [
      { label: "Dashboard", icon: FaHome, to: "/admin" },
      { label: "Live Command Center", icon: FaGlobe, to: "/admin/live-map" },
      { label: "Manage Users", icon: FaUserCog, to: "/admin/users" },
      { label: "Manage Drivers", icon: FaUsers, to: "/admin/drivers" },
      { label: "Manage Trips", icon: FaClipboardList, to: "/admin/trips" },
      { label: "Manage Vehicles", icon: FaTruck, to: "/admin/vehicles" },
      { label: "Create User", icon: FaUserPlus, to: "/admin/create-user" },
      { label: "Alerts", icon: FaBell, to: "/admin/alerts" },
      { label: "AI Tools", icon: FaRobot, to: "/admin/ai" },
      { label: "AI Analytics", icon: FaChartBar, to: "/admin/ai-analytics" },
    ],
    MANAGER: [
      { label: "Dashboard", icon: FaHome, to: "/manager" },
      { label: "Traffic Management", icon: FaCompass, to: "/manager/traffic" },
      { label: "Traffic Data", icon: FaCompass, to: "/manager/traffic-data" },
      { label: "Fleet Overview", icon: FaTruck, to: "/manager/fleet" },
      { label: "Risk Zones", icon: FaMapMarkedAlt, to: "/manager/risk-zones" },
      { label: "Route Explorer", icon: FaRoute, to: "/manager/routes" },
      { label: "Route Safety", icon: FaChartLine, to: "/manager/safety" },
    ],
    DRIVER: [
      { label: "Dashboard", icon: FaHome, to: "/driver" },
      { label: "Traffic Analysis", icon: FaMapMarkedAlt, to: "/driver/traffic-analysis" },
      { label: "Vehicle Status", icon: FaCar, to: "/driver/vehicle" },
      { label: "My Alerts", icon: FaExclamationTriangle, to: "/driver/alerts" },
      { label: "Driver Check-In", icon: FaChartLine, to: "/driver/check-in" },
      { label: "Create Trip", icon: FaRoute, to: "/driver/create-trip" },
      { label: "Trip Summary", icon: FaClipboardList, to: "/driver/trip-summary" },
    ],
  };

  const roleMenu = menuByRole[auth?.role] || [];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white fixed left-0 top-0 shadow-2xl z-50 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="p-6 border-b border-gray-700/50 relative z-10"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <FaBolt className="text-white text-2xl" />
          </motion.div>

          <div>
            <h1 className="text-xl font-bold flex items-center gap-1">
              NeuroFleet<span className="text-blue-400">X</span>
              <HiSparkles className="text-yellow-400 text-sm" />
            </h1>
            <p className="text-xs text-gray-400">Smart Fleet System</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="mt-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)] pb-4 custom-scrollbar relative z-10">
        {roleMenu.map((item, i) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;

          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.to}
                className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
              >
                {/* Active line */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Glow */}
                {active && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
                  />
                )}

                <motion.div
                  animate={active ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Icon
                    size={20}
                    className={`transition-all duration-300 ${active ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "group-hover:scale-110"
                      }`}
                  />
                </motion.div>

                <span className="flex-1 relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
            />
            <span className="font-medium">System Online</span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <FaBolt className="text-yellow-400 text-sm" />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;