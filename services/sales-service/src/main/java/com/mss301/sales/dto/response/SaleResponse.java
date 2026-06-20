package com.mss301.sales.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        String code,
        String saleTime,
        String cashier,
        Integer items,
        BigDecimal total,
        String payment,
        Instant createdAt,
        Instant updatedAt
) {
}
