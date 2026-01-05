import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { GPS } from "../api/gpsApi";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Maximize2, 
  RefreshCw, 
  Radio,
  Navigation,
  Gauge,
  Activity
} from "lucide-react";

const FleetCommandCenter = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [stats, setStats] = useState({ moving: 0, idling: 0, stopped: 0 });

  const fetchFleetData = async () => {
    try {
      const res = await GPS.getFleetLive();
      const data = res.data || [];
      
      // Transform for Chart: Map Lat/Lon to Y/X
      // Adding random jitter if coordinates are identical to prevent overlap in demo
      const formattedData = data.map(v => ({
        ...v,
        x: v.longitude,
        y: v.latitude,
        z: v.speed // Z-axis used for bubble size
      }));

      setFleet(formattedData);
      
      const s = { moving: 0, idling: 0, stopped: 0 };
      data.forEach(v => {
        if(v.status === 'MOVING') s.moving++;
        else if(v.status === 'IDLING') s.idling++;
        else s.stopped++;
      });
      setStats(s);
      
      setLastRefreshed(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fleet data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
    const interval = setInterval(fetchFleetData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'MOVING': return "#10b981"; // Green
      case 'IDLING': return "#f59e0b"; // Yellow
      default: return "#ef4444";       // Red
    }
  };

  // Custom Tooltip for the Radar Map
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 text-white p-3 rounded-lg shadow-xl border border-gray-700 backdrop-blur-md">
          <p className="font-bold text-blue-400 mb-1">{data.registrationNo}</p>
          <p className="text-xs text-gray-300">{data.driverName}</p>
          <div className="my-2 border-t border-gray-700"></div>
          <p className="text-xs flex items-center gap-2">
            <Navigation className="w-3 h-3" /> {data.status}
          </p>
          <p className="text-xs flex items-center gap-2">
            <Gauge className="w-3 h-3" /> {data.speed.toFixed(1)} km/h
          </p>
          <p className="text-[10px] text-gray-500 mt-1 font-mono">
            {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
        
        {/* Top HUD */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Maximize2 className="w-6 h-6 text-indigo-600" />
              Tactical Fleet View
            </h1>
            <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
              <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Signal
              </span>
              <span className="flex items-center">
                <RefreshCw className="w-3 h-3 mr-1" /> Updated: {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Status Counters */}
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center">
              <span className="text-xl font-bold text-green-700">{stats.moving}</span>
              <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Moving</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-100 flex flex-col items-center">
              <span className="text-xl font-bold text-yellow-700">{stats.idling}</span>
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">Idling</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center">
              <span className="text-xl font-bold text-red-700">{stats.stopped}</span>
              <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Stopped</span>
            </div>
          </div>
        </div>

        {/* Main Radar View (Scatter Plot) */}
        <div className="flex-1 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden group">
          
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>

          {loading && fleet.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
               <div className="flex flex-col items-center">
                 <Activity className="w-12 h-12 text-blue-500 animate-bounce mb-4" />
                 <p className="text-blue-400 font-mono animate-pulse">ESTABLISHING SATELLITE UPLINK...</p>
               </div>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" name="Longitude" domain={['auto', 'auto']} hide />
                <YAxis type="number" dataKey="y" name="Latitude" domain={['auto', 'auto']} hide />
                <ZAxis type="number" dataKey="z" range={[100, 400]} name="Speed" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Vehicles" data={fleet} onClick={(node) => setSelectedVehicle(node.payload)}>
                  {fleet.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {/* Radar Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-900/30 rounded-3xl"></div>
          <div className="absolute bottom-4 right-4 text-slate-600 text-xs font-mono">
            NEUROFLEET-X GRID SYSTEM v2.0
          </div>
        </div>

        {/* Selected Vehicle Detail Panel */}
        {selectedVehicle && (
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 animate-in slide-in-from-bottom-4 duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md
                ${selectedVehicle.status === 'MOVING' ? 'bg-green-500' : selectedVehicle.status === 'IDLING' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {selectedVehicle.registrationNo.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedVehicle.registrationNo}</h3>
                <p className="text-sm text-gray-500">{selectedVehicle.driverName} • {selectedVehicle.type}</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Speed</p>
                <p className="text-xl font-mono font-bold text-gray-800">{selectedVehicle.speed.toFixed(1)} <span className="text-sm text-gray-400">km/h</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Coordinates</p>
                <p className="text-xs font-mono text-gray-600 mt-1">{selectedVehicle.latitude.toFixed(3)}</p>
                <p className="text-xs font-mono text-gray-600">{selectedVehicle.longitude.toFixed(3)}</p>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FleetCommandCenter;