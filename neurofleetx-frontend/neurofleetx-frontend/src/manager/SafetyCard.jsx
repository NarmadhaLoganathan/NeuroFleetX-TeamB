import { useState } from "react";

export default function SafetyCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  // Helper functions
  const getSafetyColor = (score) => {
    if (score >= 80) return "#10B981"; // Safe - Green
    if (score >= 60) return "#F59E0B"; // Moderate - Yellow
    if (score >= 40) return "#F97316"; // Caution - Orange
    return "#EF4444"; // High Risk - Red
  };

  const getSafetyIcon = (score) => {
    if (score >= 80) return "🛡️";
    if (score >= 60) return "⚠️";
    if (score >= 40) return "🚧";
    return "🚨";
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return "Very Low";
    if (score >= 60) return "Low";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "High";
    return "Very High";
  };

  const riskCategories = [
    {
      name: "Night Risk",
      value: data.nightRisk,
      icon: "🌙",
      description: "Safety during night hours",
      tips: ["Travel in well-lit areas", "Avoid isolated roads", "Share live location"]
    },
    {
      name: "Weather Risk",
      value: data.weatherRisk,
      icon: "🌧️",
      description: "Weather-related hazards",
      tips: ["Check weather forecast", "Reduce speed in rain", "Use headlights"]
    },
    {
      name: "Crime Risk",
      value: data.crimeRisk,
      icon: "🚨",
      description: "Crime statistics in area",
      tips: ["Stay in populated areas", "Keep valuables hidden", "Lock doors"]
    },
    {
      name: "Road Risk",
      value: data.roadConditionRisk,
      icon: "🛣️",
      description: "Road conditions & maintenance",
      tips: ["Watch for potholes", "Avoid construction zones", "Maintain safe distance"]
    }
  ];

  const overallScore = data.safetyScore;
  const safetyColor = getSafetyColor(overallScore);
  const safetyIcon = getSafetyIcon(overallScore);

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "24px",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      marginBottom: "24px"
    }}>
      {/* Card Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "28px 32px",
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>
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
          alignItems: "flex-start",
          position: "relative",
          zIndex: "1"
        }}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}>
                🔐
              </div>
              <div>
                <h3 style={{
                  margin: "0",
                  fontSize: "20px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px"
                }}>
                  {data.routeName}
                </h3>
                <p style={{
                  margin: "4px 0 0 0",
                  fontSize: "14px",
                  opacity: "0.9"
                }}>
                  Comprehensive Safety Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "44px",
              height: "44px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              transition: "all 0.3s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
            }}
          >
            ▼
          </button>
        </div>

        {/* Safety Score Circle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          marginTop: "24px"
        }}>
          <div style={{
            position: "relative",
            width: "120px",
            height: "120px",
            flexShrink: "0"
          }}>
            {/* Outer Circle */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: `conic-gradient(${safetyColor} ${(overallScore / 100) * 360}deg, rgba(255,255,255,0.1) 0deg)`
            }}></div>
            
            {/* Inner Circle */}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "100px",
              height: "100px",
              background: "#0f172a",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                fontSize: "36px",
                fontWeight: "800",
                color: safetyColor,
                lineHeight: "1"
              }}>
                {overallScore.toFixed(0)}
              </div>
              <div style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                marginTop: "4px"
              }}>
                /100
              </div>
            </div>
          </div>

          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}>
              <div style={{
                fontSize: "32px"
              }}>
                {safetyIcon}
              </div>
              <div>
                <div style={{
                  fontSize: "14px",
                  opacity: "0.9",
                  marginBottom: "4px"
                }}>
                  Safety Level
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: safetyColor
                }}>
                  {data.safetyLevel}
                </div>
              </div>
            </div>
            
            <div style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px"
            }}>
              <div style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "12px", opacity: "0.9" }}>Risk Level</div>
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: getSafetyColor(100 - overallScore) 
                }}>
                  {getRiskLevel(100 - overallScore)}
                </div>
              </div>
              
              <div style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "12px", opacity: "0.9" }}>Analysis Time</div>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div style={{
        padding: "32px"
      }}>
        <h4 style={{
          margin: "0 0 24px 0",
          fontSize: "18px",
          fontWeight: "600",
          color: "#1F2937",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span>📊</span>
          Risk Category Analysis
        </h4>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px"
        }}>
          {riskCategories.map((category, index) => {
            const riskScore = category.value;
            const riskColor = getSafetyColor(riskScore);
            const riskLevel = getRiskLevel(riskScore);
            
            return (
              <div
                key={index}
                onClick={() => setSelectedRisk(selectedRisk === index ? null : index)}
                style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: selectedRisk === index ? "translateY(-4px)" : "none",
                  boxShadow: selectedRisk === index ? "0 8px 24px rgba(0, 0, 0, 0.08)" : "0 4px 12px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: `${riskColor}15`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}>
                    {category.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      marginBottom: "4px"
                    }}>
                      {category.name}
                    </div>
                    <div style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: riskColor
                    }}>
                      {riskScore.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: "8px",
                  background: "#F3F4F6",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "12px"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${riskScore}%`,
                    background: riskColor,
                    borderRadius: "4px",
                    transition: "width 1s ease"
                  }}></div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#6B7280"
                }}>
                  <span>Risk Level</span>
                  <span style={{ 
                    fontWeight: "600", 
                    color: riskColor 
                  }}>
                    {riskLevel}
                  </span>
                </div>

                {/* Expanded Tips */}
                {selectedRisk === index && (
                  <div style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #F3F4F6"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "8px"
                    }}>
                      {category.description}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "#374151"
                    }}>
                      <strong>Safety Tips:</strong>
                      <ul style={{
                        margin: "8px 0 0 0",
                        paddingLeft: "16px"
                      }}>
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} style={{ marginBottom: "4px" }}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expanded Risk Factors Section */}
        {expanded && (
          <div style={{
            marginTop: "32px",
            padding: "24px",
            background: "#F9FAFB",
            borderRadius: "16px",
            border: "1px solid #E5E7EB"
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
                background: "#3B82F6",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "white"
              }}>
                ⚠️
              </div>
              <h4 style={{
                margin: "0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937"
              }}>
                Detailed Risk Factors
              </h4>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px"
            }}>
              {data.riskFactors.map((factor, index) => {
                // Extract severity from factor text or use index-based color
                let severity = "medium";
                let severityColor = "#F59E0B";
                
                if (factor.toLowerCase().includes("low") || factor.toLowerCase().includes("minor")) {
                  severity = "low";
                  severityColor = "#10B981";
                } else if (factor.toLowerCase().includes("high") || factor.toLowerCase().includes("severe")) {
                  severity = "high";
                  severityColor = "#EF4444";
                }

                return (
                  <div key={index} style={{
                    padding: "16px",
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      background: severityColor,
                      borderRadius: "50%",
                      marginTop: "6px",
                      flexShrink: "0"
                    }}></div>
                    <div style={{ flex: "1" }}>
                      <div style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "4px"
                      }}>
                        {factor}
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{
                          fontSize: "12px",
                          color: "#6B7280"
                        }}>
                          Factor #{index + 1}
                        </div>
                        <div style={{
                          padding: "2px 8px",
                          background: `${severityColor}20`,
                          color: severityColor,
                          fontSize: "11px",
                          fontWeight: "600",
                          borderRadius: "12px",
                          textTransform: "uppercase"
                        }}>
                          {severity} severity
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safety Recommendations */}
            <div style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #E5E7EB"
            }}>
              <h4 style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>💡</span>
                Safety Recommendations
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "12px"
              }}>
                {[
                  "Share your route with trusted contacts",
                  "Enable emergency SOS on your phone",
                  "Travel during daylight hours when possible",
                  "Keep vehicle doors locked at all times",
                  "Maintain safe following distance",
                  "Check weather conditions before departure"
                ].map((recommendation, index) => (
                  <div key={index} style={{
                    padding: "12px 16px",
                    background: "#F0FDF4",
                    borderRadius: "8px",
                    border: "1px solid #BBF7D0",
                    display: "flex",
                    alignItems: "center",
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
                      flexShrink: "0"
                    }}>
                      {index + 1}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "#065F46"
                    }}>
                      {recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: "20px 32px",
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
          <button style={{
            padding: "12px 24px",
            borderRadius: "10px",
            background: "#F3F4F6",
            color: "#374151",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#E5E7EB"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#F3F4F6"}
          >
            <span>📄</span>
            Generate Report
          </button>
          
          <button style={{
            padding: "12px 24px",
            borderRadius: "10px",
            background: "#FEF3C7",
            color: "#92400E",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#FDE68A"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#FEF3C7"}
          >
            <span>🔔</span>
            Set Safety Alert
          </button>
        </div>
        
        <button style={{
          padding: "14px 32px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
          color: "white",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.4)";
        }}
        >
          <span>🛡️</span>
          View Safety Details
          <span style={{ fontSize: "18px", marginLeft: "4px" }}>→</span>
        </button>
      </div>

      {/* Legend */}
      <div style={{
        padding: "16px 32px",
        background: "#F3F4F6",
        borderTop: "1px solid #E5E7EB",
        fontSize: "12px",
        color: "#6B7280",
        display: "flex",
        justifyContent: "center",
        gap: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></div>
          Low Risk (80-100)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }}></div>
          Moderate (60-79)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F97316" }}></div>
          Caution (40-59)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></div>
          High Risk (0-39)
        </div>
      </div>
    </div>
  );
}