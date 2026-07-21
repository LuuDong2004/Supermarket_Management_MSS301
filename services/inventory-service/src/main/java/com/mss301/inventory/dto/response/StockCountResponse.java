package com.mss301.inventory.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record StockCountResponse(
        UUID id,
        String code,
        String location,
        String status,
        LocalDate countDate,
        String note,
        String productCode,
        String productName,
        Integer systemQty,
        Integer physicalQty,
        Integer difference,
        String reason,
        String category,
        Instant createdAt,
        Instant updatedAt
) {
}
