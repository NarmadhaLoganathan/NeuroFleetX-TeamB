package com.neurofleetx.Route_Safety_Scoring.model;

import lombok.Data;
import java.util.List;

@Data
public class RouteSafetyScore {

    private String routeName;
    private double safetyScore;         // 0–1
    private List<String> riskFactors;   // list of risks
    private String safetyLevel;         // LOW / MEDIUM / HIGH

    private double nightRisk;
    private double weatherRisk;
    private double crimeRisk;
    private double roadConditionRisk;
}
