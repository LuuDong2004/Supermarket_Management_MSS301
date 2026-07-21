package com.mss301.inventory.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record StockAdjustmentResponse(
        UUID id,
        String code,
        String product,
        Integer systemQty,
        Integer countedQty,
        Integer diff,
        String reason,
        LocalDate adjDate,
        String status,
        String evidenceName,
        String decisionComment,
        Instant createdAt,
        Instant updatedAt
) {
}
