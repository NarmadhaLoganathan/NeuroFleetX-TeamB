import { useState } from "react";
import TurnByTurn from "./TurnByTurn";

export default function RouteList({ routes, startLocation, endLocation }) {
  const [expandedRoute, setExpandedRoute] = useState(0);
  const [savedRoutes, setSavedRoutes] = useState({});

  if (!routes || routes.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "80px 40px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "24px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
      }}>
        <div style={{
          width: "120px",
          height: "120px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "56px",
          color: "white",
          margin: "0 auto 32px auto",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
        }}>
          🛣️
        </div>
        <h3 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1F2937",
          marginBottom: "12px"
        }}>
          No Routes Available
        </h3>
        <p style={{
          fontSize: "16px",
          color: "#6B7280",
          maxWidth: "400px",
          margin: "0 auto 32px auto",
          lineHeight: "1.6"
        }}>
          Select start and end locations to discover AI-optimized routes with real-time traffic insights.
        </p>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 24px",
          background: "#F3F4F6",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)"
            }}></div>
            <span style={{ fontSize: "14px", color: "#374151" }}>Start point</span>
          </div>
          <div style={{
            height: "1px",
            width: "40px",
            background: "linear-gradient(90deg, #10B981, #EF4444)"
          }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#EF4444",
              boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)"
            }}></div>
            <span style={{ fontSize: "14px", color: "#374151" }}>Destination</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveRoute = (index) => {
    setSavedRoutes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getTrafficIcon = (level) => {
    switch (level) {
      case 'Low': return '🟢';
      case 'Medium': return '🟡';
      case 'High': return '🔴';
      default: return '🟢';
    }
  };

  return (
    <div style={{
      background: "transparent",
      borderRadius: "24px",
      overflow: "hidden"
    }}>
      {/* Route Summary Header */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "28px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <div>
            <h2 style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "white"
              }}>
                📍
              </span>
              Route Overview
            </h2>
            <p style={{
              margin: "0",
              fontSize: "14px",
              color: "#6B7280",
              paddingLeft: "60px"
            }}>
              {startLocation} → {endLocation} • {routes.length} route{routes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              padding: "16px 24px",
              background: "#F0F9FF",
              borderRadius: "12px",
              border: "1px solid #BAE6FD",
              minWidth: "140px"
            }}>
              <div style={{
                fontSize: "12px",
                color: "#0369A1",
                marginBottom: "6px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <span>🚀</span> Total Routes
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#0284C7",
                lineHeight: "1"
              }}>
                {routes.length}
              </div>
            </div>
            
            <div style={{
              padding: "16px 24px",
              background: "#F0FDF4",
              borderRadius: "12px",
              border: "1px solid #BBF7D0",
              minWidth: "140px"
            }}>
              <div style={{
                fontSize: "12px",
                color: "#059669",
                marginBottom: "6px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <span>⏱️</span> Best Time
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#10B981",
                lineHeight: "1"
              }}>
                {routes[0]?.totalDurationMin?.toFixed(0)}<span style={{ fontSize: "16px", fontWeight: "600" }}>min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Visualization Bar */}
        <div style={{
          position: "relative",
          height: "8px",
          background: "#F3F4F6",
          borderRadius: "4px",
          margin: "32px 0",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            background: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.05) 10px, rgba(0, 0, 0, 0.05) 20px)"
          }}></div>
          
          {routes.map((route, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "0",
                left: `${(index / routes.length) * 100}%`,
                width: `${100 / routes.length}%`,
                height: "100%",
                background: index === 0 
                  ? "linear-gradient(90deg, #3B82F6, #1D4ED8)" 
                  : index === 1
                  ? "linear-gradient(90deg, #10B981, #059669)"
                  : index === 2
                  ? "linear-gradient(90deg, #8B5CF6, #7C3AED)"
                  : "linear-gradient(90deg, #F59E0B, #D97706)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: expandedRoute === index ? "scaleY(1.5)" : "scaleY(1)",
                zIndex: expandedRoute === index ? 2 : 1
              }}
              onClick={() => setExpandedRoute(index)}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            ></div>
          ))}
        </div>

        {/* Route Points */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          padding: "0 20px"
        }}>
          <div style={{
            textAlign: "center",
            width: "140px"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              background: "#10B981",
              borderRadius: "50%",
              margin: "0 auto 12px auto",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
              position: "relative",
              zIndex: 3
            }}></div>
            <div style={{
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "4px",
              fontWeight: "500"
            }}>
              START
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1F2937"
            }}>
              {startLocation}
            </div>
          </div>
          
          <div style={{
            textAlign: "center",
            width: "140px"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              background: "#EF4444",
              borderRadius: "50%",
              margin: "0 auto 12px auto",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
              position: "relative",
              zIndex: 3
            }}></div>
            <div style={{
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "4px",
              fontWeight: "500"
            }}>
              DESTINATION
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1F2937"
            }}>
              {endLocation}
            </div>
          </div>
        </div>
      </div>

      {/* Route Cards Container */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {routes.map((route, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease",
              transform: expandedRoute === index ? "scale(1.02)" : "scale(1)",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.05)";
            }}
          >
            {/* Route Ribbon for Recommended */}
            {index === 0 && (
              <div style={{
                position: "absolute",
                top: "20px",
                right: "-40px",
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                color: "white",
                padding: "8px 40px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transform: "rotate(45deg)",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                zIndex: 2
              }}>
                ⭐ RECOMMENDED
              </div>
            )}

            {/* Route Header */}
            <div
              style={{
                background: index === 0 
                  ? "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" 
                  : index === 1
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  : index === 2
                  ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                  : "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
                padding: "24px",
                color: "white",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                opacity: "0.3"
              }}></div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                zIndex: 1
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{
                      margin: "0 0 8px 0",
                      fontSize: "20px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      {route.routeName}
                      {savedRoutes[index] && (
                        <span style={{ fontSize: "16px" }}>🔖</span>
                      )}
                    </h3>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "14px",
                      opacity: "0.9"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        🗺️ Route {index + 1}
                      </span>
                      <span style={{ opacity: "0.5" }}>•</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {getTrafficIcon(route.trafficLevel)} {route.trafficLevel} Traffic
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span>🚦</span> Option {index + 1}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div
              style={{
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                borderBottom: "1px solid #F3F4F6"
              }}
            >
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "#F0F9FF",
                borderRadius: "12px",
                border: "1px solid #BAE6FD",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  fontSize: "14px",
                  color: "#0369A1",
                  marginBottom: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <span>📏</span> Distance
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#0284C7",
                  lineHeight: "1"
                }}>
                  {route.totalDistanceKm.toFixed(1)}
                  <span style={{ fontSize: "16px", fontWeight: "600", marginLeft: "4px" }}>km</span>
                </div>
              </div>
              
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "#F0FDF4",
                borderRadius: "12px",
                border: "1px solid #BBF7D0"
              }}>
                <div style={{
                  fontSize: "14px",
                  color: "#059669",
                  marginBottom: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <span>⏱️</span> Duration
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#10B981",
                  lineHeight: "1"
                }}>
                  {route.totalDurationMin.toFixed(0)}
                  <span style={{ fontSize: "16px", fontWeight: "600", marginLeft: "4px" }}>min</span>
                </div>
              </div>
              
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: route.trafficLevel === 'High' 
                  ? "#FEF2F2" 
                  : route.trafficLevel === 'Medium'
                  ? "#FEFCE8"
                  : "#F0FDF4",
                borderRadius: "12px",
                border: `1px solid ${
                  route.trafficLevel === 'High' 
                    ? "#FECACA" 
                    : route.trafficLevel === 'Medium'
                    ? "#FDE68A"
                    : "#BBF7D0"
                }`
              }}>
                <div style={{
                  fontSize: "14px",
                  color: route.trafficLevel === 'High' 
                    ? "#DC2626" 
                    : route.trafficLevel === 'Medium'
                    ? "#CA8A04"
                    : "#059669",
                  marginBottom: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <span>🚦</span> Traffic
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: route.trafficLevel === 'High' 
                    ? "#DC2626" 
                    : route.trafficLevel === 'Medium'
                    ? "#CA8A04"
                    : "#059669",
                  lineHeight: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}>
                  {getTrafficIcon(route.trafficLevel)}
                  <span style={{ fontSize: "20px" }}>{route.trafficLevel}</span>
                </div>
              </div>
              
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "#F5F3FF",
                borderRadius: "12px",
                border: "1px solid #DDD6FE"
              }}>
                <div style={{
                  fontSize: "14px",
                  color: "#7C3AED",
                  marginBottom: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <span>⛽</span> Est. Fuel
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#7C3AED",
                  lineHeight: "1"
                }}>
                  ₹{Math.round(route.totalDistanceKm * 6.5)}
                  <span style={{ fontSize: "16px", fontWeight: "600", marginLeft: "4px" }}>INR</span>
                </div>
              </div>
            </div>

            {/* Interactive Section */}
            <div style={{ padding: "24px" }}>
              {/* Expand/Collapse Button */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: expandedRoute === index ? "20px" : "0",
                cursor: "pointer"
              }} onClick={() => setExpandedRoute(expandedRoute === index ? null : index)}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    background: "#F3F4F6",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    transition: "all 0.3s ease",
                    transform: expandedRoute === index ? "rotate(180deg)" : "rotate(0deg)"
                  }}>
                    🔽
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1F2937"
                    }}>
                      Turn-by-Turn Directions
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      {expandedRoute === index ? "Click to collapse" : "Click to expand"} • {route.turnByTurn?.length || 0} steps
                    </div>
                  </div>
                </div>
                
                <div style={{
                  padding: "8px 16px",
                  background: "#F3F4F6",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#4B5563",
                  fontWeight: "500"
                }}>
                  {expandedRoute === index ? "Hide Details" : "Show Details"}
                </div>
              </div>

              {/* Turn By Turn Directions */}
              {expandedRoute === index && (
                <div style={{ marginTop: "20px" }}>
                  <TurnByTurn steps={route.turnByTurn} />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              padding: "20px 24px",
              background: "#F9FAFB",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{
                display: "flex",
                gap: "12px"
              }}>
                <button
                  onClick={() => handleSaveRoute(index)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: savedRoutes[index] ? "#FEF3C7" : "#F3F4F6",
                    color: savedRoutes[index] ? "#92400E" : "#4B5563",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span>{savedRoutes[index] ? "🔖" : "💾"}</span>
                  {savedRoutes[index] ? "Saved" : "Save Route"}
                </button>
                
                <button
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: "#F3F4F6",
                    color: "#4B5563",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span>📊</span>
                  Compare
                </button>
              </div>
              
              <button
                style={{
                  padding: "16px 32px",
                  borderRadius: "12px",
                  background: index === 0 
                    ? "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" 
                    : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: index === 0 
                    ? "0 4px 20px rgba(59, 130, 246, 0.4)" 
                    : "0 4px 20px rgba(16, 185, 129, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = index === 0 
                    ? "0 8px 30px rgba(59, 130, 246, 0.5)" 
                    : "0 8px 30px rgba(16, 185, 129, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = index === 0 
                    ? "0 4px 20px rgba(59, 130, 246, 0.4)" 
                    : "0 4px 20px rgba(16, 185, 129, 0.4)";
                }}
              >
                <span>🚗</span>
                Start Navigation
                <span style={{ fontSize: "20px", marginLeft: "4px" }}>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: "32px",
        padding: "20px",
        background: "white",
        borderRadius: "16px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
      }}>
        <h4 style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#4B5563",
          marginBottom: "16px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Legend
        </h4>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px"
        }}>
          {[
            { color: "#3B82F6", label: "Recommended Route", icon: "⭐" },
            { color: "#10B981", label: "Balanced Route", icon: "⚖️" },
            { color: "#8B5CF6", label: "Alternative Route", icon: "🔄" },
            { color: "#F59E0B", label: "Economic Route", icon: "💰" },
            { color: "#10B981", label: "Start Point", icon: "📍" },
            { color: "#EF4444", label: "Destination", icon: "🎯" }
          ].map((item, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              background: "#F9FAFB",
              borderRadius: "8px"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                background: item.color
              }}></div>
              <span style={{ fontSize: "14px", color: "#4B5563" }}>
                <span style={{ marginRight: "8px" }}>{item.icon}</span>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}