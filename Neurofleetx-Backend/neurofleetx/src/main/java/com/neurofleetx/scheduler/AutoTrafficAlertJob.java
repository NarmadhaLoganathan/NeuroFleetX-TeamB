//package com.neurofleetx.scheduler;
//
//import com.neurofleetx.dto.PredictResponseDto;
//import com.neurofleetx.entity.Vehicle;
//import com.neurofleetx.entity.Alert;
//import com.neurofleetx.entity.AlertSeverity;
//import com.neurofleetx.service.AIService;
//import com.neurofleetx.service.AlertService;
//import com.neurofleetx.repository.VehicleRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class AutoTrafficAlertJob {
//
//    private final VehicleRepository vehicleRepo;
//    private final AIService aiService;
//    private final AlertService alertService;
//
//    @Scheduled(fixedRate = 1000)  // every 1 second
//    public void autoCheckTraffic() {
//
//        List<Vehicle> vehicles = vehicleRepo.findAll();
//
//        for (Vehicle vehicle : vehicles) {
//
//            String location = vehicle.getCurrentLocation();
//            if (location == null || location.isEmpty()) continue;
//
//            // Predict using AI model
//            PredictResponseDto prediction = aiService.predictForLocation(location);
//
//            String congestion = prediction.getCongestion_level();
//
//            // If HIGH or CRITICAL -> generate alert
//            if (congestion.equalsIgnoreCase("HIGH") ||
//                    congestion.equalsIgnoreCase("CRITICAL")) {
//
//                Alert alert = new Alert();
//                alert.setAlertType("CONGESTION");
//                alert.setSeverity(AlertSeverity.valueOf(congestion.toUpperCase()));
//                alert.setDescription("High congestion detected at " + location);
//                alert.setVehicle(vehicle);
//                alert.setIsResolved(false);
//
//                alertService.createAlert(alert);
//
//                System.out.println("🚨 ALERT GENERATED: " + location + " — " + congestion);
//            }
//        }
//    }
//}
