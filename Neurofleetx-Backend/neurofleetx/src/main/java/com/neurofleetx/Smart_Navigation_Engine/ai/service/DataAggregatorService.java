package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.AggregatedData;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DataAggregatorService {

    private final MapService mapService;
    private final Trafficservice trafficService;
    private final WeatherService weatherService;
    private final GraphBuilder graphBuilder;
    private final AStarService aStarService;

    public DataAggregatorService(MapService mapService,
                                 Trafficservice trafficService,
                                 WeatherService weatherService,
                                 GraphBuilder graphBuilder,
                                 AStarService aStarService) {
        this.mapService = mapService;
        this.trafficService = trafficService;
        this.weatherService = weatherService;
        this.graphBuilder = graphBuilder;
        this.aStarService = aStarService;
    }

    public AggregatedData aggregate(double startLat, double startLng,
                                    double endLat, double endLng) {

        // 1) Try ORS route JSON (optional)
        Map<String, Object> orsJson = null;
        try {
            orsJson = mapService.getRoute(startLat, startLng, endLat, endLng);
        } catch (Exception ignore) {}

        List<Node> graph;

        if (orsJson != null) {
            try {
                var features = (List<Map<String, Object>>) orsJson.get("features");

                if (features != null && !features.isEmpty()) {
                    var geometry = (Map<String, Object>) features.get(0).get("geometry");

                    List<List<Number>> coords =
                            (List<List<Number>>) geometry.get("coordinates");

                    // NEW method
                    graph = graphBuilder.buildFromOsmOrOrs(coords);
                } else {
                    graph = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);
                }

            } catch (Exception e) {
                graph = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);
            }

        } else {
            graph = graphBuilder.buildMultiRouteGraph(startLat, startLng, endLat, endLng, 25);
        }

        // 3) Run A*
        Node start = graph.get(0);
        Node goal = graph.get(graph.size() - 1);

        List<Node> path = aStarService.findPath(start, goal, 0.7);

        double distKm = aStarService.totalDistanceKm(path);
        double durationSec = (distKm / 40.0) * 3600;

        double traffic = trafficService.getTrafficScore(startLat, startLng, endLat, endLng);
        double weather = weatherService.getWeatherScore(endLat, endLng);

        return new AggregatedData(distKm * 1000, durationSec, traffic, weather);
    }
}
