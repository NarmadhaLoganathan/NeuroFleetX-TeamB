package com.neurofleetx.Smart_Navigation_Engine.ai.model;

import java.util.List;

public class RouteRecommendation {

    private String routeName;
    private double confidence;
    private String reason;
    private double etaMinutes;
    private double distanceKm;
    private double durationMin;
    private double trafficScore;
    private double weatherScore;
    private List<String> alternatives;

    public RouteRecommendation() {}

    // Getters & Setters
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public double getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(double etaMinutes) { this.etaMinutes = etaMinutes; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public double getDurationMin() { return durationMin; }
    public void setDurationMin(double durationMin) { this.durationMin = durationMin; }

    public double getTrafficScore() { return trafficScore; }
    public void setTrafficScore(double trafficScore) { this.trafficScore = trafficScore; }

    public double getWeatherScore() { return weatherScore; }
    public void setWeatherScore(double weatherScore) { this.weatherScore = weatherScore; }

    public List<String> getAlternatives() { return alternatives; }
    public void setAlternatives(List<String> alternatives) { this.alternatives = alternatives; }
}
