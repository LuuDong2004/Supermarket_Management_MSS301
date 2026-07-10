package com.mss301.supplier.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SupplierPriceItemResponse(
        UUID id,
        String code,
        String supplier,
        String productName,
        String unit,
        BigDecimal price,
        Integer moq,
        String status,
        String note,
        Instant createdAt,
        Instant updatedAt
) {
}
