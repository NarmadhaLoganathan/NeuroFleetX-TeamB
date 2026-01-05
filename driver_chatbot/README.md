# Driver Panel Chatbot - Integration Guide

This project runs a Python FastAPI microservice that uses Google Gemini to answer driver questions based on a mock knowledge base.

## 1. Setup & Run Python Service

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Configure API Key**:
    - Rename `.env.example` to `.env`.
    - Paste your Google Gemini API Key inside.
3.  **Run the Server**:
    ```bash
    python main.py
    ```
    The server will start at `http://localhost:8000`.

## 2. Connect from Spring Boot (Java)

You can call the `/chat` endpoint using `RestTemplate` or `WebClient`.

### Request Format
**POST** `http://localhost:8000/chat`
```json
{
  "user_id": "driver_123",
  "message": "How do I start a trip?"
}
```

### Java Example (using RestTemplate)

```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

public class ChatbotService {

    private final String PYTHON_SERVICE_URL = "http://localhost:8000/chat";
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
            // Make Request
            ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_SERVICE_URL, request, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("reply");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Chatbot service is currently unavailable.";
        }
        
        return "Error processing request.";
    }
}
```

## 3. Deployment
- Ensure both the Spring Boot app and this Python service are running.
- If deploying to a cloud (AWS/GCP), deploy this Python app as a containerized service (Docker) or on a VM, and update the `PYTHON_SERVICE_URL` in your Java code.
