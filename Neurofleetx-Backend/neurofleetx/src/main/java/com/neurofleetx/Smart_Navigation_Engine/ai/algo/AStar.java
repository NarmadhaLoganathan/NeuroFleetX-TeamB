package com.neurofleetx.Smart_Navigation_Engine.ai.algo;

import java.util.*;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

public class AStar {

    public List<Node> findPath(Node start, Node goal, double trafficScore) {

        PriorityQueue<Node> open = new PriorityQueue<>(Comparator.comparingDouble(Node::getF));
        Map<Node, Double> gScore = new HashMap<>();
        Map<Node, Node> cameFrom = new HashMap<>();

        start.setG(0);
        start.setF(start.haversineDistance(goal));
        gScore.put(start, 0.0);
        open.add(start);

        Set<Node> closed = new HashSet<>();

        while (!open.isEmpty()) {
            Node current = open.poll();

            if (current.equals(goal)) {
                return reconstructPath(cameFrom, current);
            }

            closed.add(current);

            List<Node> neighbors = current.getNeighbors();
            if (neighbors == null) continue;

            for (Node neighbor : neighbors) {
                if (closed.contains(neighbor)) continue;

                double base = current.haversineDistance(neighbor);

                // Traffic-aware weighted distance
                double weighted = base * (1 + (1 - trafficScore));

                double tentativeG = gScore.getOrDefault(current, Double.POSITIVE_INFINITY) + weighted;

                if (tentativeG < gScore.getOrDefault(neighbor, Double.POSITIVE_INFINITY)) {

                    cameFrom.put(neighbor, current);
                    gScore.put(neighbor, tentativeG);

                    neighbor.setG(tentativeG);
                    neighbor.setF(tentativeG + neighbor.haversineDistance(goal));

                    open.remove(neighbor);
                    open.add(neighbor);
                }
            }
        }

        return Collections.emptyList();
    }

    private List<Node> reconstructPath(Map<Node, Node> cameFrom, Node current) {
        LinkedList<Node> path = new LinkedList<>();
        path.addFirst(current);

        while (cameFrom.containsKey(current)) {
            current = cameFrom.get(current);
            path.addFirst(current);
        }
        return path;
    }
}
