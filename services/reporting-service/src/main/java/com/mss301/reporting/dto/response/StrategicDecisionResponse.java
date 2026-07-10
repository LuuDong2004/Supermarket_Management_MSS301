package com.mss301.reporting.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record StrategicDecisionResponse(
        UUID id,
        String code,
        String title,
        String category,
        String priority,
        String status,
        LocalDate decisionDate,
        String owner,
        String description,
        Instant createdAt,
        Instant updatedAt
) {
}
