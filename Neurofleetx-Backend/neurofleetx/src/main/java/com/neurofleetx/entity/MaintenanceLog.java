package com.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "maintenance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maintenanceId;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private String maintenanceType;
    private Double cost;
    private String description;

    private LocalDateTime maintenanceDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        if (this.maintenanceDate == null) {
            this.maintenanceDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        }
    }
}
