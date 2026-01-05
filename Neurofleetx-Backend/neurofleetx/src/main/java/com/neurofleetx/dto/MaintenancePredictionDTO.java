package com.neurofleetx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaintenancePredictionDTO {
    private Integer nextServiceKm;
    private String urgency;
    private String recommendation;
}
