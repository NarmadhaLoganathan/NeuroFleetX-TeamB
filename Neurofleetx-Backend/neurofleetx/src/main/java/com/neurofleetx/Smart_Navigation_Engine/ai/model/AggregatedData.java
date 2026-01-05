package com.neurofleetx.Smart_Navigation_Engine.ai.model;

public class AggregatedData {

    private double distanceMeters;
    private double durationSeconds;
    private double trafficScore;
    private double weatherScore;

    public AggregatedData(double distanceMeters, double durationSeconds, double trafficScore, double weatherScore) {
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.trafficScore = trafficScore;
        this.weatherScore = weatherScore;
    }

    public double getDistanceMeters() {
        return distanceMeters;
    }

    public double getDurationSeconds() {
        return durationSeconds;
    }

    public double getTrafficScore() {
        return trafficScore;
    }

    public double getWeatherScore() {
        return weatherScore;
    }

    // Helper summary for LLM
    public String simpleSummary() {
        return "distance(m): " + distanceMeters +
                ", duration(s): " + durationSeconds +
                ", trafficScore: " + trafficScore +
                ", weatherScore: " + weatherScore;
    }
}
