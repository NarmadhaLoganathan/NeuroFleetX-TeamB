package com.neurofleetx.Smart_Navigation_Engine.ai.algo;

import com.neurofleetx.Smart_Navigation_Engine.ai.model.Node;

@FunctionalInterface
public interface WeightFunction {
    double cost(Node a, Node b);

    // Default heuristic (can be overridden)
    default double estimate(Node a, Node b) {
        return a.haversineDistance(b);
    }
}
