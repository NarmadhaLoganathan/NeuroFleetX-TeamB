package com.neurofleetx.util;

import java.util.Map;

public class DriverKnowledgeBase {

    public static final Map<String, String> KNOWLEDGE = Map.of(
        "create_trip",
        "To create a trip: Go to Dashboard → Click Start Trip → Enter Source & Destination → Calculate Route → Start Trip.",

        "gps",
        "GPS tracking automatically updates your location during an active trip. Make sure location permission is enabled.",

        "traffic",
        "Traffic Analysis helps you choose the best route. Dashboard → Traffic Analysis → Enter Source & Destination.",

        "vehicle",
        "Vehicle Status shows assigned vehicle, last location, and maintenance prediction.",

        "alerts",
        "Alerts notify you about incidents, traffic issues, or vehicle problems.",

        "trip_summary",
        "Trip Summary shows completed trips with distance, duration, and status.",

        "checkin",
        "Manual Check-In lets you update location and speed from Dashboard → Check-In."
    );
}
