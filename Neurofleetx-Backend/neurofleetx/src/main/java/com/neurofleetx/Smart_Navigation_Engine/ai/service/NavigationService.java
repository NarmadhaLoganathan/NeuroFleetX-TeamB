package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Instruction;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.ArrayList;
import java.util.List;

@Service
public class NavigationService {

    private static final double TURN_THRESHOLD_DEG = 30.0;   // >30° => turn
    private static final double SLIGHT_TURN_DEG = 15.0;      // 15..30 => slight
    private static final double MIN_SEGMENT_M = 10.0;        // ignore tiny segments

    /**
     * Generate human-friendly turn-by-turn instructions from path nodes.
     * - Aggregates consecutive segments with small bearing change into single "continue" step.
     * - Emits turns when bearing change > TURN_THRESHOLD_DEG.
     */
    public List<Instruction> generateDirections(List<Node> path) {
        List<Instruction> result = new ArrayList<>();
        if (path == null || path.size() < 2) return result;

        // Compute per-segment bearings and distances
        List<Double> bearings = new ArrayList<>();
        List<Double> dists = new ArrayList<>();

        for (int i = 0; i < path.size() - 1; i++) {
            Node a = path.get(i);
            Node b = path.get(i + 1);
            double distM = haversineMeters(a, b);
            double brg = bearing(a, b);
            dists.add(distM);
            bearings.add(brg);
        }

        // Aggregate into instructions
        double accDist = 0.0;
        double currentBearing = bearings.get(0);
        String currentAction = "Head"; // initial
        for (int i = 0; i < bearings.size(); i++) {

            double brg = bearings.get(i);
            double segDist = dists.get(i);

            // if tiny segment, accumulate and skip change detection
            if (segDist < MIN_SEGMENT_M) {
                accDist += segDist;
                continue;
            }

            double delta = smallestAngleDiff(currentBearing, brg);

            if (Math.abs(delta) <= SLIGHT_TURN_DEG) {
                // same direction -> continue / keep aggregating
                accDist += segDist;
                // keep currentBearing as weighted average for better stability
                currentBearing = normalizeBearing((currentBearing * 0.6) + (brg * 0.4));
            } else if (Math.abs(delta) <= TURN_THRESHOLD_DEG) {
                // slight turn -> flush previous "continue" then emit slight turn
                if (accDist > 0) {
                    result.add(makeContinueInstruction(currentBearing, accDist));
                }
                String text = formatTurnText(delta, false);
                result.add(new Instruction(text, segDist, brg));
                // reset aggregation
                accDist = 0;
                currentBearing = brg;
            } else {
                // major turn
                if (accDist > 0) {
                    result.add(makeContinueInstruction(currentBearing, accDist));
                }
                String text = formatTurnText(delta, true);
                result.add(new Instruction(text, segDist, brg));
                accDist = 0;
                currentBearing = brg;
            }
        }

        // Any remaining aggregated distance -> add final continue
        if (accDist > 0) {
            result.add(makeContinueInstruction(currentBearing, accDist));
        }

        // Final "You have arrived" instruction
        result.add(new Instruction("You have arrived at your destination", 0.0, currentBearing));

        return result;
    }

    private Instruction makeContinueInstruction(double bearing, double distanceM) {
        String dir = compassDirection(bearing);
        String text = String.format("Continue %s for %s", dir, humanDistance(distanceM));
        return new Instruction(text, distanceM, bearing);
    }

    private String formatTurnText(double deltaDeg, boolean major) {
        String side = deltaDeg > 0 ? "right" : "left"; // positive delta means turn right (clockwise)
        double abs = Math.abs(deltaDeg);
        if (major) {
            return String.format("Turn %s and continue", side);
        } else {
            return String.format("Slight %s and continue", side);
        }
    }

    // --- Utilities ---

    // Haversine in meters between two nodes (latitude/longitude in degrees)
    private double haversineMeters(Node a, Node b) {
        double R = 6371000d; // meters
        double dLat = Math.toRadians(b.getLat() - a.getLat());
        double dLon = Math.toRadians(b.getLng() - a.getLng());
        double lat1 = Math.toRadians(a.getLat());
        double lat2 = Math.toRadians(b.getLat());

        double sinDLat = Math.sin(dLat / 2);
        double sinDLon = Math.sin(dLon / 2);
        double aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
        double c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
        return R * c;
    }

    // Bearing in degrees from a -> b (0 = north, 90 = east)
    private double bearing(Node a, Node b) {
        double lat1 = Math.toRadians(a.getLat());
        double lat2 = Math.toRadians(b.getLat());
        double dLon = Math.toRadians(b.getLng() - a.getLng());

        double y = Math.sin(dLon) * Math.cos(lat2);
        double x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        double brg = Math.toDegrees(Math.atan2(y, x));
        return normalizeBearing(brg);
    }

    private double normalizeBearing(double brg) {
        double b = brg % 360.0;
        if (b < 0) b += 360.0;
        return b;
    }

    // smallest signed angle difference in degrees (target - source) normalized to (-180, +180]
    private double smallestAngleDiff(double source, double target) {
        double a = target - source;
        while (a <= -180) a += 360;
        while (a > 180) a -= 360;
        return a;
    }

    // convert distance in meters to human readable string
    private String humanDistance(double meters) {
        if (meters >= 1000) {
            return String.format("%.1f km", meters / 1000.0);
        } else {
            return String.format("%.0f m", meters);
        }
    }

    // map bearing to coarse compass string
    private String compassDirection(double bearing) {
        String[] cardinals = {"north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"};
        int idx = (int) Math.round(((bearing % 360) / 45.0)) % 8;
        return cardinals[idx];
    }
}
