package com.mss301.product.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PromotionResponse(
        UUID id,
        String code,
        String name,
        String scope,
        Integer discount,
        String type,
        LocalDate fromDate,
        LocalDate toDate,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
