package com.neurofleetx.Smart_Navigation_Engine.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.neurofleetx.Smart_Navigation_Engine.ai.AiRouteAgent;
import com.neurofleetx.Smart_Navigation_Engine.ai.service.DataAggregatorService;
import com.neurofleetx.Smart_Navigation_Engine.ai.service.GraphBuilder;
import com.neurofleetx.Smart_Navigation_Engine.ai.service.RouteEngineService;

import java.util.List;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    private final DataAggregatorService aggregator;
    private final AiRouteAgent aiRouteAgent;
    private final GraphBuilder graphBuilder;
    private final RouteEngineService routeEngine;

    public RouteController(
            DataAggregatorService aggregator,
            AiRouteAgent aiRouteAgent,
            GraphBuilder graphBuilder,
            RouteEngineService routeEngine
    ) {
        this.aggregator = aggregator;
        this.aiRouteAgent = aiRouteAgent;
        this.graphBuilder = graphBuilder;
        this.routeEngine = routeEngine;
    }

    /**
     * MULTI-ROUTE GENERATION ENDPOINT
     */
    @GetMapping("/routes")
    public ResponseEntity<?> routes(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng) {

        // 3 completely different graphs
        var graph1 = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);
        var graph2 = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);
        var graph3 = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);

        var r1 = routeEngine.generateSingleRoute("Shortest Route", graph1);
        var r2 = routeEngine.generateSingleRoute("Fastest Route", graph2);
        var r3 = routeEngine.generateSingleRoute("Low Traffic Route", graph3);

        return ResponseEntity.ok(List.of(r1, r2, r3));
    }
}