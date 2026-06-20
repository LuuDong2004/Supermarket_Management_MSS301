package com.mss301.notification.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record BusinessPolicyResponse(
        UUID id,
        String code,
        String name,
        String value,
        String category,
        LocalDate updatedDate,
        Instant createdAt,
        Instant updatedAt
) {
}
