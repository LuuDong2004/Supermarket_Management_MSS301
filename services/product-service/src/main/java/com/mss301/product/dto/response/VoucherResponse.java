package com.mss301.product.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record VoucherResponse(
        UUID id,
        String code,
        String type,
        BigDecimal value,
        BigDecimal minSpend,
        String label,
        Instant createdAt,
        Instant updatedAt
) {
}
