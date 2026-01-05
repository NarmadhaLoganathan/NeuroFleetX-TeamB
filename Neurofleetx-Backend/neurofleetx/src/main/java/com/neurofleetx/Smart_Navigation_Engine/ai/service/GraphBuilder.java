package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.ArrayList;
import java.util.List;

@Service
public class GraphBuilder {

    /**
     * Build graph from OpenRouteService / OSM coordinates
     * coords = [ [lon, lat], [lon, lat], ... ]
     */
    public List<Node> buildFromOsmOrOrs(List<List<Number>> coords) {
        List<Node> nodes = new ArrayList<>();

        if (coords == null || coords.isEmpty()) return nodes;

        for (List<Number> pt : coords) {
            double lon = pt.get(0).doubleValue();
            double lat = pt.get(1).doubleValue();
            nodes.add(new Node(lat, lon));
        }

        linkBidirectional(nodes);
        return nodes;
    }

    /**
     * Multi-route random graph (creates 3 route-like variations)
     */
    public List<Node> buildMultiRouteGraph(double startLat,
                                           double startLng,
                                           double endLat,
                                           double endLng,
                                           int samples) {

        List<Node> nodes = new ArrayList<>();

        if (samples < 5) samples = 5;

        for (int i = 0; i < samples; i++) {

            double t = (double) i / (samples - 1);

            // --- BASE LINE ---
            double lat = startLat + t * (endLat - startLat);
            double lng = startLng + t * (endLng - startLng);

            // --- ROUTE VARIATIONS ---
            double variationLat = lat + ((Math.random() - 0.5) * 0.01);
            double variationLng = lng + ((Math.random() - 0.5) * 0.01);

            nodes.add(new Node(variationLat, variationLng));
        }

        linkBidirectional(nodes);
        return nodes;
    }

    /**
     * Attach neighbors both directions
     */
    private void linkBidirectional(List<Node> nodes) {
        for (int i = 0; i < nodes.size(); i++) {

            Node n = nodes.get(i);

            if (i > 0) {
                n.addNeighbor(nodes.get(i - 1));
            }
            if (i < nodes.size() - 1) {
                n.addNeighbor(nodes.get(i + 1));
            }
        }
    }
}
