package com.mss301.product.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String code,
        String barcode,
        String name,
        String category,
        BigDecimal price,
        BigDecimal cost,
        Integer stock,
        String unit,
        LocalDate expiry,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {
}
