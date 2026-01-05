import { useState } from "react";
import Layout from "../components/Layout";
import { AI } from "../api/aiApi";
import { toast } from "react-toastify";
import RouteMap from "./RouteMap";
import { MapPin, Navigation, Truck, Send, Loader, AlertCircle, Map, ArrowRight } from "lucide-react";

const AIToolsPage = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const suggestRoute = async () => {
    if (!start.trim() || !end.trim() || !vehicleId.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await AI.suggestRoute(start, end, vehicleId);
      setResult(res.data);
      toast.success("Route calculated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to get route. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Navigation className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                AI Suggest Route
              </h1>
            </div>
            <p className="text-blue-100 text-sm sm:text-base mt-2">
              Get optimal routes powered by AI for your fleet
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Input Card - Sticky on Desktop */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Route Details
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Start Place Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                      Start Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-blue-500 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Enter start location"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex justify-center">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
                      <ArrowRight className="w-5 h-5 text-blue-600 transform rotate-90" />
                    </div>
                  </div>

                  {/* End Place Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                      End Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-cyan-500 pointer-events-none group-focus-within:text-cyan-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Enter end location"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Vehicle ID Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                      Vehicle ID
                    </label>
                    <div className="relative group">
                      <Truck className="absolute left-4 top-3.5 w-5 h-5 text-purple-500 pointer-events-none group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Enter vehicle ID"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={suggestRoute}
                    disabled={loading}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md flex items-center justify-center gap-2 group transform hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span>Get Best Route</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {result ? (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Distance Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-blue-200 hover:bg-blue-50/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-slate-600 text-sm font-semibold mb-1">
                            Distance
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {result.distance}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:shadow-md transition-all">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* ETA Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-cyan-200 hover:bg-cyan-50/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-slate-600 text-sm font-semibold mb-1">
                            Estimated Time
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            {result.estimatedTime}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl group-hover:shadow-md transition-all">
                          <Navigation className="w-6 h-6 text-cyan-600" />
                        </div>
                      </div>
                    </div>

                    {/* Efficiency Card */}
                    {result.efficiency && (
                      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-purple-200 hover:bg-purple-50/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-slate-600 text-sm font-semibold mb-1">
                              Efficiency
                            </p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {result.efficiency}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl group-hover:shadow-md transition-all">
                            <Truck className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Congestion Card */}
                    {result.congestionLevel && (
                      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-green-200 hover:bg-green-50/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-slate-600 text-sm font-semibold mb-1">
                              Congestion Level
                            </p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {result.congestionLevel}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl group-hover:shadow-md transition-all">
                            <AlertCircle className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Route Details Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 sm:px-8 py-6 flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                        <Map className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Route Map
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                      <RouteMap path={result.path} />
                    </div>
                  </div>

                  {/* Route Information Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 sm:px-8 py-6 flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Route Details
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.routeId && (
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-600 text-sm font-semibold mb-1">
                              Route ID
                            </p>
                            <p className="text-slate-900 font-mono font-semibold break-all">
                              {result.routeId}
                            </p>
                          </div>
                        )}
                        {result.status && (
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-600 text-sm font-semibold mb-1">
                              Status
                            </p>
                            <p className="text-slate-900 font-semibold capitalize">
                              {result.status}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* JSON Response Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 sm:px-8 py-6 flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Raw Response Data
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8 overflow-x-auto">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-auto max-h-96 border border-slate-700">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-12 min-h-96 flex items-center justify-center hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-lg transition-all">
                      <Navigation className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                      Ready to Find the Best Route?
                    </h3>
                    <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto">
                      Enter your start location, destination, and vehicle details to get started with AI-powered route optimization
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIToolsPage;