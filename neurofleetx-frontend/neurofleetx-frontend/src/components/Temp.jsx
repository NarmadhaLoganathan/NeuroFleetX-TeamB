import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Circle, CircleMarker } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const startIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

// Component to handle map re-centering
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

export default function Temp({ gpsLogs, routePath }) {
  const hasGps = gpsLogs && gpsLogs.length > 0;
  const hasRoute = routePath && routePath.length > 0;

  if (!hasGps && !hasRoute) {
    return <p className="text-center">Waiting for GPS or Route data...</p>;
  }

  const positions = hasGps ? gpsLogs.map((log) => [log.latitude, log.longitude]) : [];

  // Determine start/end/center
  // If we have GPS, use current location as center.
  // If not, use start of route.
  let center = [12.9716, 77.5946]; // Default Bangalore
  let startMarker = null;

  if (hasGps) {
    center = positions[positions.length - 1];
    startMarker = positions[0];
  } else if (hasRoute) {
    center = routePath[0]; // Start of the route
    startMarker = routePath[0];
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <RecenterMap center={center} />
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Actual GPS Logs (Movement) - Red Line */}
      {hasGps && <Polyline positions={positions} color="red" weight={4} />}

      {/* Planned Route Path (From OSRM) - Blue Dashed Line */}
      {hasRoute && (
        <Polyline
          positions={routePath}
          color="blue"
          dashArray="10, 10"
          opacity={0.6}
          weight={5}
        />
      )}

      {startMarker && (
        <Marker position={startMarker} icon={startIcon}>
          <Popup>Start Point</Popup>
        </Marker>
      )}

      {hasGps && (
        <>
          <CircleMarker center={center} radius={8} pathOptions={{ color: 'white', fillColor: '#4285F4', fillOpacity: 1, weight: 2 }}>
            <Popup>You are here</Popup>
          </CircleMarker>
          <Circle center={center} radius={50} pathOptions={{ color: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.15, weight: 0 }} />
        </>
      )}
    </MapContainer>
  );
}
