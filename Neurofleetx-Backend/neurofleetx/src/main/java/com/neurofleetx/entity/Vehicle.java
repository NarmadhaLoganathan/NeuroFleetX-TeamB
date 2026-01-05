package com.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    @Column(unique = true, nullable = false)
    private String registrationNo;

    private String vehicleType;
    private String fuelType;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.ACTIVE;

    private Double fuelLevel;
    private Integer totalDistance = 0;

    // ADD DRIVER HERE
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "current_location")
    private String currentLocation;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
}

