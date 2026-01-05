package com.neurofleetx.Smart_Navigation_Engine.ai.model;

public class Instruction {
    private String text;      // "Head north on ABC for 200 m"
    private double distanceM; // meters for this instruction
    private double bearing;   // degrees (0..360) of travel for this instruction

    public Instruction() {}

    public Instruction(String text, double distanceM, double bearing) {
        this.text = text;
        this.distanceM = distanceM;
        this.bearing = bearing;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public double getDistanceM() { return distanceM; }
    public void setDistanceM(double distanceM) { this.distanceM = distanceM; }

    public double getBearing() { return bearing; }
    public void setBearing(double bearing) { this.bearing = bearing; }
}
