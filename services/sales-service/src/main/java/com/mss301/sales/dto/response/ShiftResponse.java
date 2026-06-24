package com.mss301.sales.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ShiftResponse(
        UUID id,
        String code,
        String cashier,
        String openAt,
        String closeAt,
        BigDecimal opening,
        BigDecimal sales,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
