package com.neurofleetx.util;

public class DriverIntentUtil {

    private static final String[] DRIVER_KEYWORDS = {
        "trip", "start trip", "create trip",
        "gps", "location", "tracking",
        "traffic", "route", "signal",
        "vehicle", "maintenance",
        "alert", "warning",
        "trip summary", "history",
        "check-in", "dashboard"
    };

    public static boolean isDriverQuestion(String message) {
        String msg = message.toLowerCase();
        for (String k : DRIVER_KEYWORDS) {
            if (msg.contains(k)) return true;
        }
        return false;
    }
}
