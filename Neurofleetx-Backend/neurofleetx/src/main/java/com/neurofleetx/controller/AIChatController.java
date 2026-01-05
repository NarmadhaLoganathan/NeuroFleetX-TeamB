package com.neurofleetx.controller;

import com.neurofleetx.service.DriverChatService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final DriverChatService chatService;

    public AIChatController(DriverChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        String reply = chatService.chat(message);
        return Map.of("reply", reply);
    }
}
