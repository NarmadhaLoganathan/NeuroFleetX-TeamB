package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Instruction;
import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

import java.util.ArrayList;
import java.util.List;
@Service
public class NavigationInstructionService {

    private static final double TURN_THRESHOLD_DEGREES = 25; // only big turns

    public List<Instruction> generateDirections(List<Node> path) {

        List<Instruction> instructions = new ArrayList<>();
        if (path == null || path.size() < 2) return instructions;

        // Start instruction
        Node start = path.get(0);
        Node next = path.get(1);

        double firstDist = start.haversineDistance(next) * 1000;
        double firstBearing = computeBearing(start, next);

        instructions.add(new Instruction("Start and head forward", firstDist, firstBearing));

        // Loop through middle points
        for (int i = 1; i < path.size() - 1; i++) {

            Node prev = path.get(i - 1);
            Node curr = path.get(i);
            Node nextNode = path.get(i + 1);

            double bearing1 = computeBearing(prev, curr);
            double bearing2 = computeBearing(curr, nextNode);

            double angle = bearing2 - bearing1;

            // Normalize angle (-180 to 180)
            angle = ((angle + 540) % 360) - 180;

            double segmentDistance = curr.haversineDistance(nextNode) * 1000;

            // Only create instruction if direction changed significantly
            if (Math.abs(angle) > TURN_THRESHOLD_DEGREES) {

                String action;

                if (angle > 30) action = "Turn right";
                else if (angle < -30) action = "Turn left";
                else if (angle > 0) action = "Slight right";
                else action = "Slight left";

                instructions.add(new Instruction(
                        action + " and continue",
                        segmentDistance,
                        bearing2
                ));
            }
        }

        // End instruction
        instructions.add(new Instruction(
                "You have arrived at your destination",
                0,
                0
        ));

        return instructions;
    }
    private double computeBearing(Node a, Node b) {
        double lat1 = Math.toRadians(a.getLat());
        double lon1 = Math.toRadians(a.getLng());
        double lat2 = Math.toRadians(b.getLat());
        double lon2 = Math.toRadians(b.getLng());

        double dLon = lon2 - lon1;

        double y = Math.sin(dLon) * Math.cos(lat2);
        double x = Math.cos(lat1) * Math.sin(lat2)
                - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        double bearing = Math.toDegrees(Math.atan2(y, x));

        // normalize (0–360)
        return (bearing + 360) % 360;
    }

}