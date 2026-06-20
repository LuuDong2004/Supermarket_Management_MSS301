package com.mss301.inventory.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record WarehouseTransactionResponse(
        UUID id,
        String code,
        String type,
        String ref,
        String product,
        Integer qty,
        LocalDate txnDate,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
