package com.neurofleetx.controller;

import com.neurofleetx.dto.PredictResponseDto;
import com.neurofleetx.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/predict-congestion")
    public ResponseEntity<PredictResponseDto> predictCongestion(@RequestParam String location) {
        return ResponseEntity.ok(aiService.predictForLocation(location));
    }


   

    @GetMapping("/suggest-route")
    public ResponseEntity<Object> suggestRoute(
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(required = false) String vehicleId) {
        return ResponseEntity.ok(aiService.getSuggestedRoute(start, end, vehicleId));
    }

    // ⭐ New Endpoint Added
    @GetMapping("/risk-zones")
    public ResponseEntity<List<Map<String, Object>>> getRiskZones() {
        return ResponseEntity.ok(aiService.getRiskZones());
    }

    @GetMapping("/predict-maintenance/{vehicleId}")
    public ResponseEntity<com.neurofleetx.dto.MaintenancePredictionDTO> predictMaintenance(
            @PathVariable Long vehicleId) {
        return ResponseEntity.ok(aiService.predictMaintenance(vehicleId));
    }
}
