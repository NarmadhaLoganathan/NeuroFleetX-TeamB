import { useState } from 'react';
import RouteForm from './RouteForm';
import RouteList from './RouteList';

function RoutePlanner() {
  const [routes, setRoutes] = useState([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (data) => {
    // Set locations
    setStartLocation(data.startName);
    setEndLocation(data.endName);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate mock routes based on selected locations
      const mockRoutes = generateMockRoutes(data.startName, data.endName);
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1000);
  };

  // Function to generate mock route data
  const generateMockRoutes = (start, end) => {
    const routeNames = [
      `Via Ring Road - ${start} to ${end}`,
      `Via Main Highway - ${start} to ${end}`,
      `Scenic Route - ${start} to ${end}`,
      `Shortest Path - ${start} to ${end}`
    ];

    return routeNames.map((name, index) => ({
      routeName: name,
      totalDistanceKm: 10 + (index * 3) + Math.random() * 5,
      totalDurationMin: 25 + (index * 5) + Math.random() * 10,
      trafficLevel: index === 0 ? 'Low' : index === 1 ? 'Medium' : 'High',
      turnByTurn: generateTurnByTurn(start, end, index)
    }));
  };

  const generateTurnByTurn = (start, end, routeIndex) => {
    const baseSteps = [
      { text: `Start from ${start}`, distanceM: 0, durationMin: 0 },
      { text: 'Head northeast on Main Road', distanceM: 500, durationMin: 2 },
      { text: 'Turn left at the traffic signal', distanceM: 300, durationMin: 1 },
      { text: 'Continue straight for 2 km', distanceM: 2000, durationMin: 5 },
      { text: 'Take the 2nd exit at roundabout', distanceM: 800, durationMin: 3 },
      { text: 'Merge onto highway', distanceM: 1500, durationMin: 4 },
      { text: `Arrive at ${end}`, distanceM: 0, durationMin: 0 }
    ];

    // Modify steps slightly for different routes
    if (routeIndex === 1) {
      baseSteps.splice(3, 1, { text: 'Take flyover to avoid traffic', distanceM: 1800, durationMin: 6 });
    } else if (routeIndex === 2) {
      baseSteps.splice(2, 1, { text: 'Take scenic route along river', distanceM: 2500, durationMin: 8 });
    }

    return baseSteps;
  };

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <header style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        padding: "20px 0"
      }}>
        <h1 style={{ 
          fontSize: "42px", 
          fontWeight: "800", 
          color: "#1e293b", 
          marginBottom: "12px",
          background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🗺️ Delhi Route Navigator
        </h1>
        <p style={{ 
          color: "#64748b", 
          fontSize: "18px", 
          maxWidth: "600px", 
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          AI-powered route planning for Delhi. Select start and end locations to find optimal routes with real-time traffic insights.
        </p>
      </header>

      {/* Main Content Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 2fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Left Sidebar - Form */}
        <div style={{ position: "sticky", top: "20px" }}>
          <div style={{ 
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            marginBottom: "20px"
          }}>
            <RouteForm onSubmit={handleFormSubmit} />
          </div>
          
          {/* Info Card */}
          <div style={{ 
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #bae6fd"
          }}>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "#0369a1",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ℹ️ Route Tips
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "20px", 
              color: "#475569",
              fontSize: "14px",
              lineHeight: "1.6"
            }}>
              <li>Green routes indicate low traffic</li>
              <li>Morning (7-10 AM) has peak traffic</li>
              <li>Metro routes available for all locations</li>
              <li>Check real-time updates before travel</li>
            </ul>
          </div>
        </div>

        {/* Right Content - Results */}
        <div>
          {loading ? (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              height: "400px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                border: "4px solid #e2e8f0",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px"
              }}></div>
              <h3 style={{ color: "#475569", marginBottom: "8px" }}>Finding Best Routes...</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Analyzing traffic patterns and road conditions</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <RouteList routes={routes} startLocation={startLocation} endLocation={endLocation} />
          )}

          {/* Map Preview Placeholder */}
          {routes.length > 0 && (
            <div style={{ 
              marginTop: "30px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <h3 style={{ 
                  fontSize: "18px", 
                  fontWeight: "600", 
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🗺️ Route Map Preview
                </h3>
                <button style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  📍 Open in Full Screen
                </button>
              </div>
              
              {/* Simulated Map */}
              <div style={{
                height: "300px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Map Grid Background */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}></div>
                
                {/* Route Line */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "20%",
                  right: "20%",
                  height: "4px",
                  background: "linear-gradient(90deg, #3b82f6, #0ea5e9)",
                  borderRadius: "2px"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "-6px",
                    width: "16px",
                    height: "16px",
                    background: "#10b981",
                    borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}></div>
                  <div style={{
                    position: "absolute",
                    right: "0",
                    top: "-6px",
                    width: "16px",
                    height: "16px",
                    background: "#ef4444",
                    borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}></div>
                </div>

                {/* Waypoints */}
                {[30, 50, 70].map((pos, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${pos}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "12px",
                    height: "12px",
                    background: "white",
                    borderRadius: "50%",
                    border: "2px solid #3b82f6",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}></div>
                ))}
              </div>
              
              {/* Map Legend */}
              <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "16px",
                fontSize: "12px",
                color: "#64748b",
                justifyContent: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                  Start: {startLocation}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
                  End: {endLocation}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #3b82f6" }}></div>
                  Waypoints
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        marginTop: "60px", 
        textAlign: "center", 
        color: "#94a3b8", 
        fontSize: "14px",
        paddingTop: "20px",
        borderTop: "1px solid #e2e8f0"
      }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ color: "#475569" }}>Delhi Route Navigator</span> • Real-time traffic data powered by AI
        </div>
        <div style={{ fontSize: "12px" }}>
          © {new Date().getFullYear()} Delhi Transit Authority. Routes are simulated for demonstration purposes.
        </div>
      </footer>
    </div>
  );
}

export default RoutePlanner;