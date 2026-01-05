import os
from pyrosm import OSM
import networkx as nx
import osmnx as ox
from shapely.geometry import Point, LineString, MultiLineString

print("📍 Loading Coimbatore OSM… (2–3 sec)")

# Load OSM PBF
osm = OSM("datasets/coimbatore.osm.pbf")

# Get drivable road network
edges = osm.get_network(network_type="driving")

print("🔄 Extracting nodes...")

# Build nodes dictionary
node_dict = {}
node_id_counter = 1

def add_point(point: Point, node_dict_local):
    global node_id_counter
    coord = (point.x, point.y)

    if coord not in node_dict_local:
        node_dict_local[coord] = node_id_counter
        node_id_counter += 1
    return node_dict_local[coord]


print("🔄 Processing edges (handling LineString + MultiLineString)…")

new_edges = []

for idx, row in edges.iterrows():
    geom = row.geometry

    if geom is None:
        continue

    # If LineString → use directly
    if geom.geom_type == "LineString":
        line_segments = [geom]

    # If MultiLineString → split into single segments
    elif geom.geom_type == "MultiLineString":
        line_segments = list(geom.geoms)

    else:
        continue

    for seg in line_segments:
        coords = list(seg.coords)
        if len(coords) < 2:
            continue

        u = add_point(Point(coords[0]), node_dict)
        v = add_point(Point(coords[-1]), node_dict)

        new_edges.append({
            "u": u,
            "v": v,
            "geometry": seg,
            "length": seg.length * 111139,   # convert degrees → meters
            "highway": row.get("highway", None)
        })

print("🔧 Building graph…")

# Create MultiDiGraph
G = nx.MultiDiGraph()

# FIX 1: Add the required 'crs' attribute for osmnx functions
G.graph["crs"] = "epsg:4326"

# Add nodes
for (lon, lat), node_id in node_dict.items():
    G.add_node(node_id, x=lon, y=lat)

# Add edges
for e in new_edges:
    G.add_edge(
        e["u"],
        e["v"],
        geometry=e["geometry"],
        length=e["length"],
        highway=e["highway"]
    )

# FIX 2: Add speed + travel times, using a fallback speed for unknown segments (e.g., 30 km/h)
G = ox.add_edge_speeds(G, fallback=30)
G = ox.add_edge_travel_times(G)

print("✅ Coimbatore graph ready:", len(G.nodes), "nodes")


def compute_route_global(start_lat, start_lon, end_lat, end_lon):

    start_node = ox.distance.nearest_nodes(G, start_lon, start_lat)
    end_node = ox.distance.nearest_nodes(G, end_lon, end_lat)

    # Find shortest route by travel time
    route = nx.shortest_path(G, start_node, end_node, weight="travel_time")

    distance_m = nx.path_weight(G, route, weight="length")
    time_sec = nx.path_weight(G, route, weight="travel_time")

    # Build lat/lon polyline
    polyline = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in route]

    return {
        "success": True,
        "distance_km": round(distance_m / 1000, 2),
        "eta_minutes": round(time_sec / 60, 1),
        "path": polyline
    }