package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.RouteCandidate;

import java.util.List;

@Service
public class RouteEngineService {

    private final AStarService aStarService;
    private final NavigationInstructionService navService;

    public RouteEngineService(AStarService aStarService,
                              NavigationInstructionService navService) {
        this.aStarService = aStarService;
        this.navService = navService;
    }

    /**
     * Generate 3 alternative routes using weighted A*
     */
    public List<RouteCandidate> generateRoutes(Node start, Node goal, double trafficScore) {

        // 1️⃣ Shortest Route (ignore traffic)
        RouteCandidate shortest = buildRoute(
                "Shortest Route",
                start, goal,
                1.0   // No penalty
        );

        // 2️⃣ Fastest Route (prefers straight paths)
        RouteCandidate fastest = buildRoute(
                "Fastest Route",
                start, goal,
                0.8   // faster roads preferred
        );

        // 3️⃣ Low Traffic Route (heavily influenced by traffic)
        RouteCandidate lowTraffic = buildRoute(
                "Low Traffic Route",
                start, goal,
                1 + (1 - trafficScore) // penalty increases if trafficScore is low
        );

        return List.of(shortest, fastest, lowTraffic);
    }


    /**
     * Build a single route using weighted A*
     */
    private RouteCandidate buildRoute(String name, Node start, Node goal, double weightFactor) {

        // Weighted A* call
        List<Node> path = aStarService.findPath(start, goal, weightFactor);

        double distanceKm = aStarService.totalDistanceKm(path);
        double durationMin = (distanceKm / 40.0) * 60;

        RouteCandidate c = new RouteCandidate();
        c.setRouteName(name);
        c.setPathNodes(path);

        // For map rendering
        c.setCoordinates(
                path.stream()
                        .map(n -> new double[]{n.getLat(), n.getLng()})
                        .toList()
        );

        c.setTotalDistanceKm(distanceKm);
        c.setTotalDurationMin(durationMin);

        // ⭐ NEW: Add Turn-by-Turn Instructions
        c.setTurnByTurn(navService.generateDirections(path));

        return c;
    }


    /**
     * Used for completely different alternative graph routes
     */
    public RouteCandidate generateSingleRoute(String name, List<Node> graph) {

        Node start = graph.get(0);
        Node end = graph.get(graph.size() - 1);

        List<Node> path = aStarService.findPath(start, end, 0.7);

        double distanceKm = aStarService.totalDistanceKm(path);
        double durationMin = (distanceKm / 40.0) * 60;

        RouteCandidate c = new RouteCandidate();
        c.setRouteName(name);
        c.setPathNodes(path);

        c.setCoordinates(
                path.stream()
                        .map(n -> new double[]{n.getLat(), n.getLng()})
                        .toList()
        );

        c.setTotalDistanceKm(distanceKm);
        c.setTotalDurationMin(durationMin);

        // ⭐ Turn-by-Turn for single-route builder too
        c.setTurnByTurn(navService.generateDirections(path));

        return c;
    }

}
