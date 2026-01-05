export default function TurnByTurn({ steps }) {
  if (!steps || steps.length === 0) return null;

  const getIcon = (text) => {
    if (text.includes('Turn left')) return '↰';
    if (text.includes('Turn right')) return '↱';
    if (text.includes('Continue')) return '→';
    if (text.includes('U-turn')) return '↶';
    if (text.includes('Merge')) return '⇉';
    if (text.includes('Exit')) return '↪';
    if (text.includes('Keep left')) return '⇃';
    if (text.includes('Keep right')) return '⇂';
    if (text.includes('Destination')) return '🏁';
    if (text.includes('Start')) return '🚦';
    return '•';
  };

  return (
    <div>
      <h4
        style={{
          marginBottom: "16px",
          fontWeight: "600",
          fontSize: "16px",
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "20px" }}>🧭</span>
        Turn-by-Turn Directions
        <span style={{ 
          marginLeft: "auto", 
          fontSize: "12px", 
          fontWeight: "normal", 
          color: "#64748b",
          background: "#f1f5f9",
          padding: "2px 8px",
          borderRadius: "10px"
        }}>
          {steps.length} steps
        </span>
      </h4>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              borderBottom: i < steps.length - 1 ? "1px solid #f1f5f9" : "none",
              background: i === 0 ? "#f0f9ff" : i === steps.length - 1 ? "#fef2f2" : "white",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseOut={(e) => e.currentTarget.style.background = i === 0 ? "#f0f9ff" : i === steps.length - 1 ? "#fef2f2" : "white"}
          >
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: i === 0 ? "#0ea5e9" : i === steps.length - 1 ? "#ef4444" : "#64748b",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "600",
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                marginBottom: "4px"
              }}>
                <span style={{ fontSize: "18px" }}>{getIcon(s.text)}</span>
                <span style={{ 
                  fontWeight: "500", 
                  color: i === 0 ? "#0ea5e9" : i === steps.length - 1 ? "#ef4444" : "#1e293b"
                }}>
                  {s.text}
                </span>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginTop: "6px"
              }}>
                <div style={{ 
                  display: "flex", 
                  gap: "12px", 
                  fontSize: "13px",
                  color: "#64748b"
                }}>
                  <span style={{ 
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}>
                    📏 {Math.round(s.distanceM)} m
                  </span>
                  {s.durationMin && (
                    <span style={{ 
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "4px"
                    }}>
                      ⏱ {s.durationMin} min
                    </span>
                  )}
                </div>
                
                {s.laneInfo && (
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#475569",
                    background: "#fef3c7",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: "500"
                  }}>
                    {s.laneInfo}
                  </div>
                )}
              </div>
              
              {s.notes && (
                <div style={{ 
                  marginTop: "8px", 
                  padding: "8px 12px",
                  background: "#f8fafc",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#475569",
                  borderLeft: "3px solid #94a3b8"
                }}>
                  💡 {s.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{ 
        marginTop: "16px",
        display: "flex",
        gap: "16px",
        fontSize: "12px",
        color: "#64748b",
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#0ea5e9" }}></div>
          Start step
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
          End step
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#64748b" }}></div>
          Intermediate step
        </div>
      </div>
    </div>
  );
}