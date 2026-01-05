import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { Map } from "lucide-react";

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RouteMap = ({ path }) => {
  if (!path || path.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
        <div className="text-center">
          <div className="p-4 bg-slate-200 rounded-2xl w-fit mx-auto mb-3">
            <Map className="w-12 h-12 text-slate-500" />
          </div>
          <p className="text-slate-600 text-lg font-medium">
            Route map will appear here after prediction...
          </p>
        </div>
      </div>
    );
  }

  // Leaflet expects: [lat, lon]
  const start = path[0];
  const end = path[path.length - 1];

  return (
    <MapContainer
      center={start}
      zoom={13}
      className="h-96 w-full rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
      scrollWheelZoom={true}
      whenCreated={(map) => {
        // Fit map to route
        const bounds = L.latLngBounds(path);
        map.fitBounds(bounds, { padding: [50, 50] });
      }}
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Draw route polyline */}
      <Polyline
        positions={path}
        weight={5}
        color="#0EA5E9"
        opacity={0.8}
        dashArray="0"
      />

      {/* Start marker */}
      <Marker position={start}>
        <Popup className="font-semibold text-slate-900">
          <div className="p-2">
            <p className="font-bold text-blue-600">Start Location</p>
          </div>
        </Popup>
      </Marker>

      {/* End marker */}
      <Marker position={end}>
        <Popup className="font-semibold text-slate-900">
          <div className="p-2">
            <p className="font-bold text-cyan-600">End Location</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default RouteMap;