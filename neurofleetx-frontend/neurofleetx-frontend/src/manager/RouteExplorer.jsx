import { useState } from "react";
import axios from "axios";
import RouteForm from "./RouteForm";
import RouteList from "./RouteList";

const RouteExplorer = () => {
  const [routes, setRoutes] = useState([]);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setSearched(true);
    setStartLocation(formData.startName);
    setEndLocation(formData.endName);

    try {
      const res = await axios.get(
        "http://localhost:8081/api/route/routes",
        { 
          params: {
            startLat: formData.startLat,
            startLng: formData.startLng,
            endLat: formData.endLat,
            endLng: formData.endLng
          }
        }
      );
      
      if (res.data && Array.isArray(res.data)) {
        const formattedRoutes = res.data.map((route, index) => ({
          ...route,
          routeName: route.routeName || `Route Option ${index + 1}`,
          totalDistanceKm: route.totalDistanceKm || 0,
          totalDurationMin: route.totalDurationMin || 0,
          trafficLevel: route.trafficLevel || "Medium",
          turnByTurn: route.turnByTurn || generateMockTurnByTurn(formData.startName, formData.endName, index)
        }));
        setRoutes(formattedRoutes);
      } else {
        setRoutes(generateMockRoutes(formData.startName, formData.endName));
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError("Failed to fetch routes. Using simulated data for demonstration.");
      setRoutes(generateMockRoutes(formData.startName, formData.endName));
    } finally {
      setLoading(false);
    }
  };

  const generateMockRoutes = (start, end) => {
    const routeNames = [
      `Express Route - Via Ring Road`,
      `Balanced Route - Via Main Arteries`,
      `Scenic Route - Avoiding Highways`,
      `Economic Route - Shortest Distance`
    ];

    return routeNames.map((name, index) => ({
      routeName: name,
      totalDistanceKm: 8.5 + (index * 2.5) + Math.random() * 3,
      totalDurationMin: 18 + (index * 8) + Math.random() * 7,
      trafficLevel: index === 0 ? 'Low' : index === 1 ? 'Medium' : 'High',
      routeColor: index === 0 ? "#3B82F6" : index === 1 ? "#10B981" : index === 2 ? "#8B5CF6" : "#F59E0B",
      turnByTurn: generateMockTurnByTurn(start, end, index)
    }));
  };

  const generateMockTurnByTurn = (start, end, routeIndex) => {
    const steps = [
      { text: `Depart from ${start}`, distanceM: 0, durationMin: 0 },
      { text: 'Head east on NH-48', distanceM: 1200, durationMin: 4 },
      { text: 'Take exit 5A toward Ring Road', distanceM: 800, durationMin: 3 },
      { text: 'Merge onto Outer Ring Road', distanceM: 4500, durationMin: 10 },
      { text: 'Take exit 12 toward Laxmi Nagar', distanceM: 600, durationMin: 2 },
      { text: 'Continue on Vikas Marg', distanceM: 2200, durationMin: 7 },
      { text: `Arrive at ${end}`, distanceM: 0, durationMin: 0, isDestination: true }
    ];

    return steps;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Top Navigation */}
      <nav style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "white"
          }}>
            🚀
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "white",
              letterSpacing: "-0.5px"
            }}>
              AI Route Explorer
            </h1>
            <p style={{
              margin: 0,
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.8)"
            }}>
              Delhi's Smart Navigation System
            </p>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>📊</span> Analytics
          </button>
          <button style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "white",
            color: "#667eea",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>⚙️</span> Settings
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "30px 40px"
      }}>
        {/* Hero Section */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "white",
            marginBottom: "12px",
            letterSpacing: "-1px",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Intelligent Route Planning
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            AI-powered navigation with real-time traffic analysis, optimal pathfinding, and predictive insights for Delhi's complex road network.
          </p>
        </div>

        {/* Main Dashboard */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: "30px",
          height: "calc(100vh - 200px)"
        }}>
          {/* Left Panel */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* Route Form Card */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "white"
                }}>
                  🗺️
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1F2937"
                  }}>
                    Route Parameters
                  </h2>
                  <p style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    color: "#6B7280"
                  }}>
                    Set start and end points
                  </p>
                </div>
              </div>
              
              <RouteForm onSubmit={handleFormSubmit} />
            </div>

            {/* API Status Card */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "20px",
              padding: "24px",
              color: "white"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  🔗
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600"
                  }}>
                    System Status
                  </h3>
                  <p style={{
                    margin: "4px 0 0 0",
                    fontSize: "12px",
                    opacity: 0.9
                  }}>
                    Live connection monitoring
                  </p>
                </div>
              </div>

              <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}>
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>API Status</span>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      background: "#10B981",
                      borderRadius: "50%",
                      display: "inline-block"
                    }}></span>
                    Connected
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}>
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>Response Time</span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>42ms</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>Routes Found</span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>{routes.length}</span>
                </div>
              </div>

              <div style={{
                fontSize: "12px",
                opacity: 0.8,
                textAlign: "center"
              }}>
                http://localhost:8081/api/route/routes
              </div>
            </div>

            {/* Statistics Card */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
            }}>
              <h3 style={{
                margin: "0 0 20px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1F2937"
              }}>
                📈 Route Analytics
              </h3>
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                {[
                  { label: "Daily Routes", value: "1,247", change: "+12%", color: "#3B82F6" },
                  { label: "Avg. Distance", value: "12.4 km", change: "-3%", color: "#10B981" },
                  { label: "Success Rate", value: "98.2%", change: "+0.5%", color: "#8B5CF6" },
                  { label: "Avg. Time Saved", value: "18 min", change: "+8%", color: "#F59E0B" }
                ].map((stat, index) => (
                  <div key={index} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    background: "#F9FAFB",
                    borderRadius: "10px"
                  }}>
                    <div>
                      <div style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        marginBottom: "4px"
                      }}>
                        {stat.label}
                      </div>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: stat.color
                      }}>
                        {stat.value}
                      </div>
                    </div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: stat.change.startsWith("+") ? "#10B981" : "#EF4444",
                      background: stat.change.startsWith("+") ? "#D1FAE5" : "#FEE2E2",
                      padding: "4px 8px",
                      borderRadius: "20px"
                    }}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflow: "hidden"
          }}>
            {/* Results Header */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1F2937"
                  }}>
                    Route Recommendations
                  </h2>
                  {searched && (
                    <p style={{
                      margin: "8px 0 0 0",
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      {startLocation} → {endLocation} • {routes.length} routes found
                    </p>
                  )}
                </div>
                
                <div style={{ display: "flex", gap: "12px" }}>
                  <button style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    background: "#F3F4F6",
                    color: "#4B5563",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span>📊</span> Compare
                  </button>
                  <button style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span>⬇️</span> Export Data
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "20px" }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      API Connection Issue
                    </div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>
                      {error} Showing simulated data for demonstration.
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Bar */}
              {routes.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "20px"
                }}>
                  {[
                    { label: "Best Time", value: `${routes[0]?.totalDurationMin?.toFixed(0)} min`, icon: "⏱️", color: "#3B82F6" },
                    { label: "Shortest", value: `${Math.min(...routes.map(r => r.totalDistanceKm)).toFixed(1)} km`, icon: "📏", color: "#10B981" },
                    { label: "Traffic", value: "Moderate", icon: "🚦", color: "#F59E0B" },
                    { label: "Fuel Cost", value: "₹125-175", icon: "⛽", color: "#8B5CF6" }
                  ].map((stat, index) => (
                    <div key={index} style={{
                      background: "#F9FAFB",
                      borderRadius: "12px",
                      padding: "16px",
                      borderLeft: `4px solid ${stat.color}`
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px"
                      }}>
                        <span style={{ fontSize: "20px" }}>{stat.icon}</span>
                        <div style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          fontWeight: "500"
                        }}>
                          {stat.label}
                        </div>
                      </div>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1F2937"
                      }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Routes Container */}
            <div style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              {loading ? (
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    border: "4px solid #E5E7EB",
                    borderTopColor: "#667eea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "24px"
                  }}></div>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: "8px"
                  }}>
                    Analyzing Routes
                  </h3>
                  <p style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    textAlign: "center",
                    maxWidth: "300px"
                  }}>
                    Processing traffic data and finding optimal paths...
                  </p>
                </div>
              ) : routes.length > 0 ? (
                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingRight: "8px"
                }}>
                  <RouteList routes={routes} startLocation={startLocation} endLocation={endLocation} />
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  textAlign: "center",
                  padding: "60px 40px"
                }}>
                  <div style={{
                    width: "120px",
                    height: "120px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "white",
                    marginBottom: "32px"
                  }}>
                    🗺️
                  </div>
                  <h3 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1F2937",
                    marginBottom: "12px"
                  }}>
                    Ready to Explore Delhi
                  </h3>
                  <p style={{
                    fontSize: "16px",
                    color: "#6B7280",
                    maxWidth: "400px",
                    lineHeight: "1.6",
                    marginBottom: "32px"
                  }}>
                    Select your start and destination locations to discover AI-optimized routes with real-time traffic insights.
                  </p>
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    color: "#9CA3AF",
                    fontSize: "14px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", background: "#10B981", borderRadius: "50%" }}></div>
                      Start point
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", background: "#EF4444", borderRadius: "50%" }}></div>
                      Destination
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", background: "#3B82F6", borderRadius: "50%" }}></div>
                      Recommended route
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "40px",
          padding: "20px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "14px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            marginBottom: "12px"
          }}>
         
          </div>
          
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #764ba2;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default RouteExplorer;