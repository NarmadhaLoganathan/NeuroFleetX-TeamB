package com.neurofleetx.Smart_Navigation_Engine.ai.model;

import java.util.ArrayList;
import java.util.List;

public class Node {

    private double lat;
    private double lng;

    private double g = Double.POSITIVE_INFINITY;
    private double f = Double.POSITIVE_INFINITY;

    private Node parent;

    private List<Node> neighbors = new ArrayList<>();

    public Node(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }

    // Haversine distance (KM)
    public double haversineDistance(Node other) {
        double R = 6371;

        double dLat = Math.toRadians(other.lat - this.lat);
        double dLon = Math.toRadians(other.lng - this.lng);

        double a = Math.sin(dLat/2)*Math.sin(dLat/2) +
                Math.cos(Math.toRadians(this.lat)) *
                        Math.cos(Math.toRadians(other.lat)) *
                        Math.sin(dLon/2)*Math.sin(dLon/2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Add neighbor
    public void addNeighbor(Node n) {
        if (neighbors == null) neighbors = new ArrayList<>();
        neighbors.add(n);
    }

    // Getters, Setters
    public double getLat() { return lat; }
    public double getLng() { return lng; }

    public List<Node> getNeighbors() { return neighbors; }
    public void setNeighbors(List<Node> neigh) { this.neighbors = neigh; }

    public double getG() { return g; }
    public void setG(double g) { this.g = g; }

    public double getF() { return f; }
    public void setF(double f) { this.f = f; }

    public Node getParent() { return parent; }
    public void setParent(Node parent) { this.parent = parent; }
}
