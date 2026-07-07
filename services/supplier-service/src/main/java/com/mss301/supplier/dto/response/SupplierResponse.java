package com.mss301.supplier.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SupplierResponse(
        UUID id,
        String code,
        String name,
        String contact,
        String phone,
        BigDecimal rating,
        String status,
        String terms,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {
}
