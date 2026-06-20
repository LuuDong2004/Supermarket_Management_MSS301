package com.mss301.sales.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String code,
        String name,
        String phone,
        String tier,
        Integer points,
        LocalDate joined,
        BigDecimal spent,
        Instant createdAt,
        Instant updatedAt
) {
}
