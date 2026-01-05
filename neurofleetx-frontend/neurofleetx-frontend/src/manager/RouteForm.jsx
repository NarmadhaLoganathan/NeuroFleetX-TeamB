import { useState } from 'react';

export default function RouteForm({ onSubmit }) {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const locations = {
    'Bhalswa': { lat: 28.7406, lng: 77.1721 },
    'Jahanqir Puri': { lat: 28.7325, lng: 77.1856 },
    'Wazirabad': { lat: 28.7195, lng: 77.2246 },
    'Shalimar Bagh': { lat: 28.7167, lng: 77.1633 },
    'Model Town': { lat: 28.7098, lng: 77.1813 },
    'Ashok Vihar': { lat: 28.6942, lng: 77.1851 },
    'Punjabi Bagh': { lat: 28.6742, lng: 77.1228 },
    'Moti Nagar': { lat: 28.6609, lng: 77.1493 },
    'Kirti Nagar': { lat: 28.6533, lng: 77.1499 },
    'Rajouri Garden': { lat: 28.6463, lng: 77.1211 },
    'Hari Nagar': { lat: 28.6368, lng: 77.1282 },
    'Janakpuri': { lat: 28.6202, lng: 77.0915 },
    'Karawal Nagar': { lat: 28.7314, lng: 77.2769 },
    'Khajuri': { lat: 28.7213, lng: 77.2987 },
    'Yamuna Vihar': { lat: 28.6761, lng: 77.2968 },
    'Babarpur': { lat: 28.6728, lng: 77.3056 },
    'Shahdara': { lat: 28.6692, lng: 77.2878 },
    'Gandhi Nagar': { lat: 28.6583, lng: 77.2778 },
    'Geeta Colony': { lat: 28.6497, lng: 77.2678 },
    'Laxmi Nagar': { lat: 28.6333, lng: 77.2833 },
    'Shakarpur': { lat: 28.6408, lng: 77.3072 },
    'Majnu Ka Tila': { lat: 28.7083, lng: 77.2292 },
    'North Campus': { lat: 28.6900, lng: 77.2100 },
    'Civil Lines': { lat: 28.6800, lng: 77.2200 },
    'Sadar Bazar': { lat: 28.6631, lng: 77.2122 },
    'Rajendra Nagar': { lat: 28.6400, lng: 77.1800 },
    'Central Delhi': { lat: 28.6353, lng: 77.2250 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!startLocation || !endLocation) {
      alert('Please select both start and end locations');
      return;
    }

    const startCoords = locations[startLocation];
    const endCoords = locations[endLocation];

    onSubmit({
      startLat: startCoords.lat,
      startLng: startCoords.lng,
      endLat: endCoords.lat,
      endLng: endCoords.lng,
      startName: startLocation,
      endName: endLocation
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        marginBottom: "16px",
      }}
    >
      <h3
        style={{
          fontWeight: "600",
          fontSize: "18px",
          marginBottom: "16px",
          color: "#1e293b",
        }}
      >
        🗺️ Delhi Route Explorer
      </h3>

      <div style={{ display: "grid", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
            Start Location
          </label>
          <select
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="">Select start location</option>
            <optgroup label="Bhalswa Area">
              {['Bhalswa', 'Jahanqir Puri', 'Wazirabad', 'Shalimar Bagh', 'Model Town', 'Ashok Vihar'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="West Delhi">
              {['Punjabi Bagh', 'Moti Nagar', 'Kirti Nagar', 'Rajouri Garden', 'Hari Nagar', 'Janakpuri'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="North East Delhi">
              {['Karawal Nagar', 'Khajuri', 'Yamuna Vihar', 'Babarpur', 'Shahdara', 'Gandhi Nagar', 'Geeta Colony', 'Laxmi Nagar', 'Shakarpur'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="North/Central Delhi">
              {['Majnu Ka Tila', 'North Campus', 'Civil Lines', 'Sadar Bazar', 'Rajendra Nagar', 'Central Delhi'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
            End Location
          </label>
          <select
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="">Select end location</option>
            <optgroup label="Bhalswa Area">
              {['Bhalswa', 'Jahanqir Puri', 'Wazirabad', 'Shalimar Bagh', 'Model Town', 'Ashok Vihar'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="West Delhi">
              {['Punjabi Bagh', 'Moti Nagar', 'Kirti Nagar', 'Rajouri Garden', 'Hari Nagar', 'Janakpuri'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="North East Delhi">
              {['Karawal Nagar', 'Khajuri', 'Yamuna Vihar', 'Babarpur', 'Shahdara', 'Gandhi Nagar', 'Geeta Colony', 'Laxmi Nagar', 'Shakarpur'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="North/Central Delhi">
              {['Majnu Ka Tila', 'North Campus', 'Civil Lines', 'Sadar Bazar', 'Rajendra Nagar', 'Central Delhi'].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <button
        type="submit"
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
          color: "#fff",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        🚀 Find Best Routes
      </button>
    </form>
  );
}

const selectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
};