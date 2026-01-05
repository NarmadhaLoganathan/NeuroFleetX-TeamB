import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { AI } from "../api/aiApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Brain, MapPin, TrendingUp, Activity, AlertTriangle } from "lucide-react";

const AIAnalytics = () => {
  const [riskZones, setRiskZones] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await AI.riskZones();
        const zones = res.data || [];
        setRiskZones(zones);

        const low = zones.filter((z) => z.riskLevel === "LOW").length;
        const med = zones.filter((z) => z.riskLevel === "MEDIUM").length;
        const high = zones.filter((z) => z.riskLevel === "HIGH").length;

        setSummary([
          { name: "Low", count: low, color: "#10b981" },
          { name: "Medium", count: med, color: "#f59e0b" },
          { name: "High", count: high, color: "#ef4444" },
        ]);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const getRiskColor = (level) => {
    switch (level) {
      case "HIGH": return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "HIGH": return "🔴";
      case "MEDIUM": return "🟡";
      default: return "🟢";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Activity className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center mb-2">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          AI Analytics
        </h1>
        <p className="text-gray-600">Real-time traffic risk analysis powered by AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold opacity-90">Low Risk Zones</h3>
            <span className="text-3xl">🟢</span>
          </div>
          <p className="text-4xl font-bold">{summary.find(s => s.name === "Low")?.count || 0}</p>
          <p className="text-sm opacity-90 mt-1">Safe traffic conditions</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold opacity-90">Medium Risk Zones</h3>
            <span className="text-3xl">🟡</span>
          </div>
          <p className="text-4xl font-bold">{summary.find(s => s.name === "Medium")?.count || 0}</p>
          <p className="text-sm opacity-90 mt-1">Moderate congestion</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold opacity-90">High Risk Zones</h3>
            <span className="text-3xl">🔴</span>
          </div>
          <p className="text-4xl font-bold">{summary.find(s => s.name === "High")?.count || 0}</p>
          <p className="text-sm opacity-90 mt-1">Critical attention needed</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Risk Level Distribution
            </h2>
            <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold">
              Bar Chart
            </div>
          </div>

          {summary.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Activity className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-lg">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary}>
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '14px' }} />
                <YAxis allowDecimals={false} stroke="#6b7280" style={{ fontSize: '14px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Risk Proportion
            </h2>
            <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold">
              Pie Chart
            </div>
          </div>

          {summary.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Activity className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-lg">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* List of Zones */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-600" />
            All Risk Zones
          </h2>
          <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold">
            {riskZones.length} Zones
          </div>
        </div>

        {riskZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <AlertTriangle className="w-16 h-16 mb-3 opacity-50" />
            <p className="text-lg">No zones found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskZones.map((z, i) => (
              <div
                key={i}
                className="group p-5 border-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                      <MapPin className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{z.location}</h3>
                    </div>
                  </div>
                  <span className="text-2xl">{getRiskIcon(z.riskLevel)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      Vehicle Density
                    </span>
                    <span className="font-semibold text-gray-800">{z.density}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold border-2 ${getRiskColor(z.riskLevel)}`}>
                      {z.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIAnalytics;