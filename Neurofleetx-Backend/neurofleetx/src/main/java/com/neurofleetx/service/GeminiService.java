package com.neurofleetx.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    public String askGemini(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        try {
            Map response = webClient.post()
                    // ✅ IMPORTANT: v1 (NOT v1beta)
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Parse response safely
            List<Map> candidates = (List<Map>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "No response from AI.";
            }

            Map content = (Map) candidates.get(0).get("content");
            List<Map> parts = (List<Map>) content.get("parts");

            return parts.get(0).get("text").toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    }
}
