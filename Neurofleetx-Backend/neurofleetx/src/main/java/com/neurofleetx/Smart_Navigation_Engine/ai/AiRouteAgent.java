package com.neurofleetx.Smart_Navigation_Engine.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.AggregatedData;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.RouteRecommendation;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiRouteAgent {

    private final ChatClient chatClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public AiRouteAgent(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public RouteRecommendation analyzeRoute(AggregatedData data) {

        String system = """
                You are a route optimization expert.
                Always respond ONLY with pure JSON:
                {
                  "routeName": "...",
                  "confidence": 0.0-1.0,
                  "reason": "...",
                  "etaMinutes": number,
                  "distanceKm": number,
                  "durationMin": number,
                  "trafficScore": number,
                  "weatherScore": number,
                  "alternatives": ["...", "..."]
                }
                """;

        // Convert AggregatedData values
        double distanceKm = data.getDistanceMeters() / 1000.0;
        double durationMin = data.getDurationSeconds() / 60.0;
        double traffic = data.getTrafficScore();
        double weather = data.getWeatherScore();

        String userPrompt = """
                Analyze this travel data:
                Distance: %.2f km
                Duration: %.2f minutes
                Traffic Score: %.2f
                Weather Score: %.2f
                """.formatted(distanceKm, durationMin, traffic, weather);

        // LLM Call
        String rawResponse = chatClient
                .prompt()
                .system(system)
                .user(userPrompt)
                .call()
                .content()
                .trim();

        try {
            // Try converting AI JSON → Java Object
            return mapper.readValue(rawResponse, RouteRecommendation.class);

        } catch (Exception e) {
            // Fallback safe output
            RouteRecommendation fallback = new RouteRecommendation();
            fallback.setRouteName("Fallback Route");
            fallback.setConfidence(0.4);
            fallback.setReason("AI JSON parsing failed; fallback values used.");

            fallback.setDistanceKm(distanceKm);
            fallback.setDurationMin(durationMin);
            fallback.setEtaMinutes(durationMin);
            fallback.setTrafficScore(traffic);
            fallback.setWeatherScore(weather);

            fallback.setAlternatives(java.util.List.of("Route A", "Route B"));

            return fallback;
        }
    }
}
