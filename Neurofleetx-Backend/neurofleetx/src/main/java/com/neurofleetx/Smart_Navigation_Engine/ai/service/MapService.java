package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Service
public class MapService {

    @Value("${ors.api.key}")
    private String apiKey;

    private final RestClient client = RestClient.builder()
            .baseUrl("https://api.openrouteservice.org")
            .build();

    public Map<String, Object> getRoute(double startLat, double startLng, double endLat, double endLng) {

        String url = String.format(
                "/v2/directions/driving-car?api_key=%s&start=%f,%f&end=%f,%f",
                apiKey, startLng, startLat, endLng, endLat
        );

        log.info("Calling ORS API: {}", url);

        try {
            return client.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

        } catch (Exception e) {
            log.error("ORS route fetch failed: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch route from ORS");
        }
    }
}
