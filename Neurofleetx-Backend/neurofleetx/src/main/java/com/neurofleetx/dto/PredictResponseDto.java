package com.neurofleetx.dto;

public class PredictResponseDto {
    private double predicted_vehicles;
    private String congestion_level;

    public PredictResponseDto() {}

    public double getPredicted_vehicles() { return predicted_vehicles; }
    public void setPredicted_vehicles(double predicted_vehicles) { this.predicted_vehicles = predicted_vehicles; }

    public String getCongestion_level() { return congestion_level; }
    public void setCongestion_level(String congestion_level) { this.congestion_level = congestion_level; }
}
