import { useState } from "react";
import axios from "axios";

const RouteSafety = () => {
  const [form, setForm] = useState({
    startLat: "",
    startLng: "",
    endLat: "",
    endLng: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const mockRoutes = [
    { id: 1, name: "Via Ring Road - Express", distance: "12.4 km", time: "24 min", safetyScore: 92 },
    { id: 2, name: "Via Main Highway - Fastest", distance: "10.8 km", time: "20 min", safetyScore: 78 },
    { id: 3, name: "Scenic Route - Avoids Highways", distance: "14.2 km", time: "28 min", safetyScore: 95 },
    { id: 4, name: "City Center Route", distance: "9.5 km", time: "22 min", safetyScore: 65 }
  ];

  const mockSafetyData = {
  safetyScore: 85.5,
  safetyLevel: "Very Safe",
  riskFactors: [
    { factor: "Low crime rate area", severity: "low" },
    { factor: "Well-lit streets", severity: "low" },
    { factor: "Moderate traffic at this time", severity: "medium" },
    { factor: "Road construction on NH-48", severity: "medium" },
    { factor: "Limited pedestrian crossings", severity: "high" }
  ],
  safetyFeatures: [
    { feature: "Emergency SOS stations", count: 3 },
    { feature: "CCTV surveillance", coverage: "85%" },
    { feature: "Police patrol frequency", frequency: "Every 15 min" },
    { feature: "Street lighting", rating: "Excellent" }
  ],
  timeAnalysis: {  // Ensure this exists
    daySafety: 92,
    nightSafety: 68,
    peakHourSafety: 75
  },
  recommendations: [
    "Consider traveling during daylight hours",
    "Avoid secluded areas after 10 PM",
    "Use well-lit main roads",
    "Share your route with trusted contacts"
  ]
};

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const checkSafety = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await axios.get(
      "http://localhost:8081/api/safety/score",
      { params: form }
    );

    const apiData = res.data;

    // ✅ NORMALIZE BACKEND RESPONSE
    const normalized = {
      safetyScore: Math.round(apiData.safetyScore * 100),
      safetyLevel: apiData.safetyLevel ?? "MEDIUM",
      riskFactors: (apiData.riskFactors || []).map(r => ({
        factor: r,
        severity: "medium"
      })),
      safetyFeatures: [],
      recommendations: [],
      timeAnalysis: {
        daySafety: Math.round((1 - apiData.nightRisk) * 100),
        nightSafety: Math.round((1 - apiData.nightRisk) * 100),
        peakHourSafety: Math.round((1 - apiData.trafficRisk || 0.3) * 100)
      }
    };

    setResult(normalized);
    setSelectedRoute(mockRoutes[0]);

  } catch (err) {
    setError("Failed to fetch safety data. Using simulated data.");
    setResult(mockSafetyData);
    setSelectedRoute(mockRoutes[0]);
  } finally {
    setLoading(false);
  }
};


  const getSafetyColor = (score) => {
    if (score >= 90) return "#10B981"; // Green
    if (score >= 70) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getSafetyIcon = (score) => {
    if (score >= 90) return "🛡️";
    if (score >= 70) return "⚠️";
    return "🚨";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low": return "#10B981";
      case "medium": return "#F59E0B";
      case "high": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    // In a real app, you would fetch safety data for the selected route
    setResult(mockSafetyData);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#fff"
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: "rgba(15, 23, 42, 0.8)",
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
            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            🛡️
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "-0.5px"
            }}>
              Route Safety Analyzer
            </h1>
            <p style={{
              margin: 0,
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)"
            }}>
              AI-Powered Risk Assessment & Security Analysis
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
            <span>📊</span> Safety Report
          </button>
          <button style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            color: "white",
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
        padding: "40px"
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
          padding: "40px 0"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Intelligent Route Safety Analysis
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Advanced AI-powered safety scoring, risk factor detection, and security recommendations for your routes.
          </p>
        </div>

        {/* Main Dashboard */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: "30px"
        }}>
          {/* Left Panel - Input & Routes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Safety Input Card */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
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
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  🔍
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700"
                  }}>
                    Analyze Route Safety
                  </h2>
                  <p style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.7)"
                  }}>
                    Enter coordinates for analysis
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}>
                    Start Coordinates
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                      name="startLat"
                      placeholder="28.7041"
                      value={form.startLat}
                      onChange={handleChange}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#8B5CF6"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                    <input
                      name="startLng"
                      placeholder="77.1025"
                      value={form.startLng}
                      onChange={handleChange}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#8B5CF6"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}>
                    End Coordinates
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                      name="endLat"
                      placeholder="28.4595"
                      value={form.endLat}
                      onChange={handleChange}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#8B5CF6"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                    <input
                      name="endLng"
                      placeholder="77.0266"
                      value={form.endLng}
                      onChange={handleChange}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#8B5CF6"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>
                </div>

                <button
                  onClick={checkSafety}
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.4)";
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: "3px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Analyze Route Safety
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Available Routes Card */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <h3 style={{
                margin: "0 0 20px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>🛣️</span> Available Routes
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mockRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => handleRouteSelect(route)}
                    style={{
                      padding: "16px",
                      background: selectedRoute?.id === route.id 
                        ? "rgba(139, 92, 246, 0.15)" 
                        : "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      border: selectedRoute?.id === route.id 
                        ? "1px solid #8B5CF6" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRoute?.id !== route.id) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRoute?.id !== route.id) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      }
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px"
                    }}>
                      <div style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: selectedRoute?.id === route.id ? "#8B5CF6" : "white"
                      }}>
                        {route.name}
                      </div>
                      <div style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: getSafetyColor(route.safetyScore) + "20",
                        color: getSafetyColor(route.safetyScore)
                      }}>
                        {route.safetyScore}/100
                      </div>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.7)"
                    }}>
                      <span>📏 {route.distance}</span>
                      <span>⏱️ {route.time}</span>
                      <span>{getSafetyIcon(route.safetyScore)} Safety</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Status Card */}
            <div style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              borderRadius: "20px",
              padding: "20px",
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
                    Real-time safety monitoring
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
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>Safety API</span>
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
                    Active
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}>
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>Response Time</span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>38ms</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: "14px", opacity: 0.9 }}>Routes Analyzed</span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>1,247</span>
                </div>
              </div>

              <div style={{
                fontSize: "12px",
                opacity: 0.8,
                textAlign: "center"
              }}>
                http://localhost:8081/api/safety/score
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {error && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#FCA5A5",
                padding: "16px",
                borderRadius: "12px",
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
                    {error}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "400px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  border: "4px solid rgba(255, 255, 255, 0.1)",
                  borderTopColor: "#8B5CF6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "24px"
                }}></div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Analyzing Route Safety
                </h3>
                <p style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  textAlign: "center",
                  maxWidth: "300px"
                }}>
                  Assessing risk factors, crime data, and road conditions...
                </p>
              </div>
            ) : result ? (
              <>
                {/* Safety Score Card */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "32px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px"
                  }}>
                    <div>
                      <h2 style={{
                        margin: "0 0 8px 0",
                        fontSize: "24px",
                        fontWeight: "700"
                      }}>
                        Safety Analysis Result
                      </h2>
                      <p style={{
                        margin: "0",
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.7)"
                      }}>
                        {selectedRoute?.name || "Selected Route"}
                      </p>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      gap: "12px"
                    }}>
                      <button style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>📄</span> Export Report
                      </button>
                      <button style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        color: "white",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>🔔</span> Set Alert
                      </button>
                    </div>
                  </div>

                  {/* Main Safety Score */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "32px",
                    alignItems: "center",
                    marginBottom: "40px"
                  }}>
                    <div style={{
                      textAlign: "center",
                      padding: "32px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                      <div style={{
                        width: "160px",
                        height: "160px",
                        margin: "0 auto 20px auto",
                        position: "relative"
                      }}>
                        {/* Circular Progress */}
                        <div style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          background: `conic-gradient(${getSafetyColor(result.safetyScore)} ${(result.safetyScore / 100) * 360}deg, rgba(255,255,255,0.1) 0deg)`
                        }}></div>
                        <div style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          width: "140px",
                          height: "140px",
                          background: "#0f172a",
                          borderRadius: "50%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <div style={{
                            fontSize: "48px",
                            fontWeight: "800",
                            color: getSafetyColor(result.safetyScore),
                            lineHeight: "1"
                          }}>
                            {result.safetyScore.toFixed(0)}
                          </div>
                          <div style={{
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.7)",
                            marginTop: "4px"
                          }}>
                            /100
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: getSafetyColor(result.safetyScore),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}>
                        {getSafetyIcon(result.safetyScore)} {result.safetyLevel}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "16px",
                        marginBottom: "24px"
                      }}>
                        <div style={{
                          padding: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "12px",
                          textAlign: "center"
                        }}>
                          <div style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: "8px"
                          }}>
                            🕐 Day Safety
                          </div>
                          <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: getSafetyColor(result.timeAnalysis.daySafety)
                          }}>
                            {result.timeAnalysis.daySafety}
                          </div>
                        </div>
                        
                        <div style={{
                          padding: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "12px",
                          textAlign: "center"
                        }}>
                          <div style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: "8px"
                          }}>
                            🌙 Night Safety
                          </div>
                          <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: getSafetyColor(result.timeAnalysis.nightSafety)
                          }}>
                            {result.timeAnalysis.nightSafety}
                          </div>
                        </div>
                        
                        <div style={{
                          padding: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "12px",
                          textAlign: "center"
                        }}>
                          <div style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: "8px"
                          }}>
                            🚗 Peak Hour
                          </div>
                          <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: getSafetyColor(result.timeAnalysis.peakHourSafety)
                          }}>
                            {result.timeAnalysis.peakHourSafety}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        padding: "20px",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px"
                      }}>
                        <h4 style={{
                          margin: "0 0 16px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}>
                          ⚡ Safety Features
                        </h4>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "12px"
                        }}>
                          {result.safetyFeatures.map((feature, index) => (
                            <div key={index} style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "12px",
                              background: "rgba(255, 255, 255, 0.03)",
                              borderRadius: "8px"
                            }}>
                              <div style={{
                                width: "32px",
                                height: "32px",
                                background: "rgba(139, 92, 246, 0.2)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px"
                              }}>
                                ✅
                              </div>
                              <div>
                                <div style={{
                                  fontSize: "14px",
                                  fontWeight: "500"
                                }}>
                                  {feature.feature}
                                </div>
                                <div style={{
                                  fontSize: "12px",
                                  color: "rgba(255, 255, 255, 0.7)"
                                }}>
                                  {feature.count || feature.coverage || feature.frequency}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors & Recommendations */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px"
                  }}>
                    {/* Risk Factors */}
                    <div>
                      <h3 style={{
                        margin: "0 0 16px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        🚨 Identified Risk Factors
                      </h3>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}>
                        {result.riskFactors.map((risk, index) => (
                          <div key={index} style={{
                            padding: "16px",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "12px",
                            borderLeft: `4px solid ${getSeverityColor(risk.severity)}`
                          }}>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "4px"
                            }}>
                              <div style={{
                                fontSize: "14px",
                                fontWeight: "500"
                              }}>
                                {risk.factor}
                              </div>
                              <div style={{
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: getSeverityColor(risk.severity) + "20",
                                color: getSeverityColor(risk.severity)
                              }}>
                                {risk.severity.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 style={{
                        margin: "0 0 16px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        💡 Safety Recommendations
                      </h3>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}>
                        {result.recommendations.map((rec, index) => (
                          <div key={index} style={{
                            padding: "16px",
                            background: "rgba(16, 185, 129, 0.1)",
                            borderRadius: "12px",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px"
                          }}>
                            <div style={{
                              width: "24px",
                              height: "24px",
                              background: "#10B981",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              color: "white",
                              flexShrink: 0
                            }}>
                              {index + 1}
                            </div>
                            <div style={{
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.9)"
                            }}>
                              {rec}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Map Placeholder */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      🗺️ Safety Heat Map
                    </h3>
                    <button style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      🔍 View Full Map
                    </button>
                  </div>
                  
                  <div style={{
                    height: "200px",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    {/* Simulated Heat Map */}
                    <div style={{
                      position: "absolute",
                      inset: "0",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                    }}></div>
                    
                    {/* Route Line */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "20%",
                      right: "20%",
                      height: "4px",
                      background: getSafetyColor(result.safetyScore),
                      borderRadius: "2px",
                      filter: "blur(1px)"
                    }}>
                      <div style={{
                        position: "absolute",
                        left: "0",
                        top: "-6px",
                        width: "16px",
                        height: "16px",
                        background: "#10B981",
                        borderRadius: "50%",
                        border: "3px solid #0f172a",
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.5)"
                      }}></div>
                      <div style={{
                        position: "absolute",
                        right: "0",
                        top: "-6px",
                        width: "16px",
                        height: "16px",
                        background: "#EF4444",
                        borderRadius: "50%",
                        border: "3px solid #0f172a",
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.5)"
                      }}></div>
                    </div>

                    {/* Heat Map Dots */}
                    {[30, 50, 70].map((pos, i) => (
                      <div key={i} style={{
                        position: "absolute",
                        left: `${pos}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "40px",
                        height: "40px",
                        background: `radial-gradient(circle, ${getSafetyColor(result.safetyScore - i * 10)}40, transparent 70%)`,
                        borderRadius: "50%"
                      }}></div>
                    ))}
                  </div>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "24px",
                    marginTop: "16px",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.7)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }}></div>
                      Safe Zone
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B" }}></div>
                      Moderate Risk
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }}></div>
                      High Risk Area
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "400px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
                padding: "40px"
              }}>
                <div style={{
                  width: "120px",
                  height: "120px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                  borderRadius: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  marginBottom: "32px",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)"
                }}>
                  🛡️
                </div>
                <h3 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "12px"
                }}>
                  No Safety Data Yet
                </h3>
                <p style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  maxWidth: "400px",
                  lineHeight: "1.6",
                  marginBottom: "32px"
                }}>
                  Enter coordinates and analyze to get AI-powered safety scores, risk factors, and security recommendations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "60px",
          padding: "20px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "14px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            marginBottom: "12px"
          }}>
            <span>Route Safety Analyzer v2.0</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Powered by AI & Real-time Crime Data</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Delhi Police Certified</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.6 }}>
            © {new Date().getFullYear()} Advanced Security Systems. All safety assessments are simulated for demonstration.
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
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #8B5CF6;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default RouteSafety;