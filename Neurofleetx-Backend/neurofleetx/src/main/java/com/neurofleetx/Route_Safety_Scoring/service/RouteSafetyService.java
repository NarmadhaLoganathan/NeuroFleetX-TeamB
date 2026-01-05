package com.neurofleetx.Route_Safety_Scoring.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Route_Safety_Scoring.model.RouteSafetyScore;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteSafetyService {

    public RouteSafetyScore scoreRoute(String routeName, List<Node> pathNodes) {

        // ----- Dummy scoring logic (later we can plug real APIs) -----
        double nightRisk = Math.random() * 0.4;       // 0–0.4
        double weatherRisk = Math.random() * 0.3;     // 0–0.3
        double crimeRisk = Math.random() * 0.5;       // 0–0.5
        double roadRisk = Math.random() * 0.4;        // 0–0.4

        double total = nightRisk + weatherRisk + crimeRisk + roadRisk;
        double safetyScore = 1 - Math.min(1, total / 1.6);

        List<String> risks = new ArrayList<>();
        if (nightRisk > 0.25) risks.add("Low street lights / night visibility risk");
        if (weatherRisk > 0.2) risks.add("Bad weather on route");
        if (crimeRisk > 0.3) risks.add("High crime density zone");
        if (roadRisk > 0.25) risks.add("Poor road conditions reported");

        RouteSafetyScore score = new RouteSafetyScore();
        score.setRouteName(routeName);
        score.setNightRisk(nightRisk);
        score.setWeatherRisk(weatherRisk);
        score.setCrimeRisk(crimeRisk);
        score.setRoadConditionRisk(roadRisk);
        score.setSafetyScore(safetyScore);

        score.setRiskFactors(risks);

        if (safetyScore > 0.75) score.setSafetyLevel("HIGH");
        else if (safetyScore > 0.45) score.setSafetyLevel("MEDIUM");
        else score.setSafetyLevel("LOW");

        return score;
    }
}
