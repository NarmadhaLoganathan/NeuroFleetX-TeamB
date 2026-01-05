package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.algo.AStar;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.List;

@Service
public class AStarService {

    private final AStar aStar = new AStar();

    /**
     * ⭐ Traffic-aware A* Pathfinding
     * @param start starting node
     * @param goal destination node
     * @param trafficScore 0.0 - heavy traffic, 1.0 - free road
     */
    public List<Node> findPath(Node start, Node goal, double trafficScore) {
        return aStar.findPath(start, goal, trafficScore);
    }

    /**
     * ⭐ Fallback method (no traffic impact)
     * Used when someone still calls old A* without traffic score.
     */
    public List<Node> findPath(Node start, Node goal) {
        return aStar.findPath(start, goal, 1.0); // Assume perfect traffic
    }

    /**
     * ⭐ Total distance of path in KM
     * Uses haversine distance of each segment.
     */
    public double totalDistanceKm(List<Node> path) {
        if (path == null || path.size() < 2) return 0;

        double total = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            total += path.get(i).haversineDistance(path.get(i + 1));
        }
        return total;
    }

    /**
     * ⭐ (Optional helper)
     * Calculate estimated time in seconds using speed KM/H
     * Example: 40 km/h default
     */
    public double estimateDurationSeconds(double distanceKm, double speedKmH) {
        if (speedKmH <= 0) speedKmH = 40; // Default speed fallback
        return (distanceKm / speedKmH) * 3600;
    }

}
