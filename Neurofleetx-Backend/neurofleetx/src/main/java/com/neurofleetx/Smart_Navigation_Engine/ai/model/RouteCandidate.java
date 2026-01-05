package com.neurofleetx.Smart_Navigation_Engine.ai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

@Data
public class RouteCandidate {

    private String routeName;

    private double totalDistanceKm;
    private double totalDurationMin;

    // For LLM & ranking
    private double trafficScore;
    private double weatherRiskScore;
    private double aiConfidence;

    // Internal path nodes (ignored by JSON)
    @JsonIgnore
    private List<Node> pathNodes;

    // Simplified coordinate output for UI / Frontend Map
    private List<double[]> coordinates;

    // ⭐ NEW: Turn-by-turn navigation instructions
    private List<Instruction> turnByTurn;
}
