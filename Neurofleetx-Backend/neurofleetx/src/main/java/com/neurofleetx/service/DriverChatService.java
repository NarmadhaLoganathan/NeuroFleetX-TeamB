package com.neurofleetx.service;

import com.neurofleetx.util.DriverIntentUtil;
import com.neurofleetx.util.DriverKnowledgeBase;
import org.springframework.stereotype.Service;

@Service
public class DriverChatService {

    private final GeminiService geminiService;

    public DriverChatService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String chat(String message) {

        // 🚫 BLOCK NON-DRIVER QUESTIONS
        if (!DriverIntentUtil.isDriverQuestion(message)) {
            return "I can help only with Driver Panel related questions.";
        }

        // ✅ STRICT DRIVER PROMPT
        String prompt = """
                You are a DRIVER HELP ASSISTANT for NeuroFleetX.

                RULES:
                - Answer ONLY about Driver Panel features
                - Do NOT answer general knowledge
                - Explain in simple steps
                - If unrelated, say you cannot help

                DRIVER FEATURES:
                %s

                QUESTION:
                %s
                """.formatted(DriverKnowledgeBase.KNOWLEDGE.values(), message);

        try {
            String response = geminiService.askGemini(prompt);
            return response != null ? response : "Unable to process request.";
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            e.printStackTrace();
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    }
}
