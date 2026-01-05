package com.neurofleetx.controller;

import com.neurofleetx.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Allow requests from Frontend
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String userId = payload.getOrDefault("user_id", "guest");
        String message = payload.get("message");

        if (message == null || message.trim().isEmpty()) {
             Map<String, String> error = new HashMap<>();
             error.put("reply", "Message cannot be empty.");
             return ResponseEntity.badRequest().body(error);
        }

        String response = chatbotService.askChatbot(userId, message);

        Map<String, String> result = new HashMap<>();
        result.put("reply", response);

        return ResponseEntity.ok(result);
    }
}
