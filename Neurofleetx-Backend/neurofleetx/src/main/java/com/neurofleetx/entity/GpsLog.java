// package com.neurofleetx.entity;
// import jakarta.persistence.*;
// import lombok.*;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "gps_logs")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class GpsLog {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long gpsId;

//     @ManyToOne
//     @JoinColumn(name = "vehicle_id", nullable = false)
//     private Vehicle vehicle;
//     @Column(name = "junction_id")
//     private Long junctionId;

//     @Column(name = "timestamp")
//     private LocalDateTime timestamp;

//     private Double latitude;
//     private Double longitude;
//     private Double speed;
// }
package com.neurofleetx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gps_log")
public class GpsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;
    private Double speed;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;

    // 🔥 LINK TO VEHICLE (needed for fleet tracking)
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // 🔥 LINK TO TRIP (NEW, nullable for old logs)
    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    public GpsLog() {
        this.loggedAt = LocalDateTime.now();
    }

    // --- getters & setters ---

    public Long getId() {
        return id;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
}
