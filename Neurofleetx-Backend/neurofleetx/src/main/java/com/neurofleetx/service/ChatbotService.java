package com.neurofleetx.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotService {

    // Assuming the Python service runs locally on port 8000
    private static final String PYTHON_SERVICE_URL = "http://localhost:8000/chat";
    private final RestTemplate restTemplate = new RestTemplate();

    public String askChatbot(String userId, String question) {
        // Prepare JSON body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("message", question);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            // Make Request to Python Microservice
            ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_SERVICE_URL, request, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("reply");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, the chatbot service is currently unavailable. Please try again later.";
        }
        
        return "Sorry, I could not process your request.";
    }
}
