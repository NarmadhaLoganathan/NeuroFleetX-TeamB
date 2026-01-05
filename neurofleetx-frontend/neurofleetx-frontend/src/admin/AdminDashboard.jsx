import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Vehicles } from "../api/vehicleApi";
import { AI } from "../api/aiApi";
import { motion } from "framer-motion";
import { 
  FaCar, 
  FaCheckCircle, 
  FaPauseCircle, 
  FaExclamationTriangle,
  FaUsers,
  FaRobot,
  FaChartLine,
  FaMapMarkerAlt
} from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehiclesRes, riskRes] = await Promise.all([
          Vehicles.getAll(),
          AI.riskZones()
        ]);
        setVehicles(vehiclesRes.data || []);
        setRiskZones(riskRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- STATS CALCULATION ---
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'ACTIVE').length,
    idle: vehicles.filter(v => v.status === 'IDLE').length,
    stuck: vehicles.filter(v => v.status === 'STUCK').length,
    human: vehicles.filter(v => !v.vehicleType?.toLowerCase().includes('auto')).length,
    autonomous: vehicles.filter(v => v.vehicleType?.toLowerCase().includes('auto')).length,
  };

  // Congestion Level based on stuck vehicles
  const congestionLevel = stats.stuck > 5 ? "HIGH" : stats.stuck > 2 ? "MEDIUM" : "LOW";
  const congestionColor = stats.stuck > 5 ? "text-red-600" : stats.stuck > 2 ? "text-orange-500" : "text-green-600";
  const congestionBg = stats.stuck > 5 ? "bg-red-50" : stats.stuck > 2 ? "bg-orange-50" : "bg-green-50";
  const congestionBorder = stats.stuck > 5 ? "border-red-200" : stats.stuck > 2 ? "border-orange-200" : "border-green-200";

  // Data for Charts
  const statusData = [
    { name: 'Active', value: stats.active, color: '#10B981' },
    { name: 'Idle', value: stats.idle, color: '#F59E0B' },
    { name: 'Stuck', value: stats.stuck, color: '#EF4444' },
  ];

  const vehicleTypeData = [
    { name: 'Human Driven', value: stats.human, color: '#6366F1' },
    { name: 'Autonomous', value: stats.autonomous, color: '#8B5CF6' },
  ];

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
            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
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
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            City Overview Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Real-time fleet and congestion monitoring</p>
        </motion.div>

        {/* --- SECTION 1: VEHICLE OVERVIEW STATS --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<FaCar className="text-2xl" />} 
            title="Total Vehicles" 
            value={stats.total} 
            gradient="from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard 
            icon={<FaCheckCircle className="text-2xl" />} 
            title="Active Vehicles" 
            value={stats.active} 
            gradient="from-green-500 to-green-600"
            delay={0.1}
          />
          <StatCard 
            icon={<FaPauseCircle className="text-2xl" />} 
            title="Idle Vehicles" 
            value={stats.idle} 
            gradient="from-yellow-500 to-yellow-600"
            delay={0.2}
          />
          <StatCard 
            icon={<FaExclamationTriangle className="text-2xl" />} 
            title="Stuck / Jammed" 
            value={stats.stuck} 
            gradient="from-red-500 to-red-600"
            delay={0.3}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* --- SECTION 2: LIVE CONGESTION & TYPES --- */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <MdSpeed className="text-indigo-600 text-2xl"/> System Status
            </h3>
            
            <div className={`mb-6 p-6 ${congestionBg} border-2 ${congestionBorder} rounded-xl`}>
              <p className="text-sm text-gray-600 mb-2 font-medium">Live City Congestion</p>
              <motion.p 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-bold ${congestionColor}`}
              >
                {congestionLevel}
              </motion.p>
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stats.stuck > 5 ? "bg-red-500" : stats.stuck > 2 ? "bg-orange-500" : "bg-green-500"} animate-pulse`}></div>
                <p className="text-xs text-gray-600">Real-time monitoring</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Human Driven</p>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-indigo-600" />
                  <p className="text-2xl font-bold text-gray-800">{stats.human}</p>
                </div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Autonomous</p>
                <div className="flex items-center gap-2">
                  <FaRobot className="text-purple-600" />
                  <p className="text-2xl font-bold text-gray-800">{stats.autonomous}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- SECTION 3: STATUS DISTRIBUTION CHART --- */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <FaChartLine className="text-purple-600 text-xl"/> Fleet Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  innerRadius={60} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* --- SECTION 4: RISK ZONE HEATMAP --- */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <FaMapMarkerAlt className="text-red-600 text-xl"/> Risk Zone Heatmap
            </h3>
            <div className="space-y-3 max-h-[260px] overflow-y-auto custom-scrollbar">
              {riskZones.length === 0 ? (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
                  <p className="text-gray-400 font-medium">No risk zones detected</p>
                  <p className="text-xs text-gray-400 mt-1">All areas are safe</p>
                </div>
              ) : (
                riskZones.map((zone, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border-l-4 hover:shadow-md transition-all duration-300" 
                    style={{borderColor: getRiskColor(zone.riskLevel)}}
                  >
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-xl" style={{color: getRiskColor(zone.riskLevel)}} />
                      <span className="font-semibold text-gray-700 text-sm">{zone.location}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getRiskBadge(zone.riskLevel)}`}>
                      {zone.riskLevel}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* --- SECTION 5: VEHICLE TYPE COMPARISON --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
            <FaRobot className="text-indigo-600 text-2xl"/> Vehicle Type Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vehicleTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </Layout>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, gradient, delay }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div className={`p-4 bg-gradient-to-br ${gradient} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white">{icon}</div>
      </div>
      
      <div className="text-right flex-1 ml-4">
        <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
        <motion.h3 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          {value}
        </motion.h3>
      </div>
    </div>
  </motion.div>
);

const getRiskColor = (level) => {
  if (level === 'CRITICAL' || level === 'HIGH') return '#EF4444';
  if (level === 'MEDIUM') return '#F59E0B';
  return '#10B981';
};

const getRiskBadge = (level) => {
  if (level === 'CRITICAL' || level === 'HIGH') return 'bg-red-100 text-red-700 border border-red-200';
  if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  return 'bg-green-100 text-green-700 border border-green-200';
};

export default AdminDashboard;