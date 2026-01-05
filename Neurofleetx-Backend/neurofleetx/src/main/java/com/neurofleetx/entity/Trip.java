package com.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "trip")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    private String startLocation;
    private String endLocation;

    // Changed to IST LocalDateTime
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime eta;

    private Double distance;
    private Double fuelConsumed;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PENDING;

    private LocalDateTime createdAt;

    // Automatically sets IST timestamp
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
}
