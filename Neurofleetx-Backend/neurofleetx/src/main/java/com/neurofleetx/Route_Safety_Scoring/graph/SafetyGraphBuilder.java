package com.neurofleetx.Route_Safety_Scoring.graph;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.ArrayList;
import java.util.List;

@Service
public class SafetyGraphBuilder {

    public List<Node> buildSampled(double startLat, double startLng, double endLat, double endLng, int samples) {

        List<Node> nodes = new ArrayList<>();

        if (samples < 2) samples = 2;

        for (int i = 0; i < samples; i++) {
            double t = (double) i / (samples - 1);
            double lat = startLat + t * (endLat - startLat);
            double lng = startLng + t * (endLng - startLng);

            nodes.add(new Node(lat, lng));
        }

        for (int i = 0; i < nodes.size(); i++) {
            Node n = nodes.get(i);
            if (i > 0) n.addNeighbor(nodes.get(i - 1));
            if (i < nodes.size() - 1) n.addNeighbor(nodes.get(i + 1));
        }

        return nodes;
    }
}
