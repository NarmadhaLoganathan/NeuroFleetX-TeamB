package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    public double getWeatherScore(double lat, double lng) {

        // Fake weather simulation for now (replace with real API later)
        double temperature = 20 + Math.random() * 20;   // 20-40°C
        double rain = Math.random();                    // 0–1
        double wind = Math.random() * 15;               // km/h

        // Weather badness score
        double score = (rain * 0.5) + (wind / 30.0) + ((temperature - 20) / 40.0);

        return Math.min(1.0, score);
    }
}
