package com.mss301.reporting.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StrategicDecisionRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 40) String category,
        @NotBlank @Size(max = 20) String priority,
        @NotBlank @Size(max = 30) String status,
        @NotNull LocalDate decisionDate,
        @NotBlank @Size(max = 120) String owner,
        @Size(max = 1000) String description
) {
}
