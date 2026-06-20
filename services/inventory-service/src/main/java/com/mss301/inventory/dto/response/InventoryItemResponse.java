package com.mss301.inventory.dto.response;

import java.time.Instant;
import java.util.UUID;

public record InventoryItemResponse(
        UUID id,
        String code,
        String productCode,
        String name,
        String category,
        Integer onHand,
        Integer threshold,
        String location,
        String unit,
        Instant createdAt,
        Instant updatedAt
) {
}
