package com.neurofleetx.Route_Safety_Scoring.controller;


import org.springframework.web.bind.annotation.*;

import com.neurofleetx.Route_Safety_Scoring.graph.SafetyGraphBuilder;
import com.neurofleetx.Route_Safety_Scoring.model.RouteSafetyScore;
import com.neurofleetx.Route_Safety_Scoring.service.RouteSafetyService;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;
import com.neurofleetx.Smart_Navigation_Engine.ai.service.AStarService;

import java.util.List;

@RestController
@RequestMapping("/api/safety")
public class SafetyController {

    private final SafetyGraphBuilder graphBuilder;
    private final RouteSafetyService safetyService;
    private final AStarService aStarService;

    public SafetyController(
            SafetyGraphBuilder graphBuilder,
            RouteSafetyService safetyService,
            AStarService aStarService
    ) {
        this.graphBuilder = graphBuilder;
        this.safetyService = safetyService;
        this.aStarService = aStarService;
    }

    @GetMapping("/score")
    public RouteSafetyScore score(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng
    ) {

        // 1️⃣ Build simple graph
        List<Node> graph = graphBuilder.buildSampled(startLat, startLng, endLat, endLng, 20);

        // 2️⃣ Get start & end nodes
        Node start = graph.get(0);
        Node end = graph.get(graph.size() - 1);

        // 3️⃣ Use A* to compute a path
        List<Node> path = aStarService.findPath(start, end, 1.0);

        // 4️⃣ Compute safety score
        return safetyService.scoreRoute("Safety Route", path);
    }
}
