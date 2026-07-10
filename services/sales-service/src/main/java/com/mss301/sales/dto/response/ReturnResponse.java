package com.mss301.sales.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ReturnResponse(
        UUID id,
        String code,
        String saleCode,
        String cashier,
        String customerCode,
        String returnDate,
        String reason,
        BigDecimal refundAmount,
        String status,
        String note,
        List<ReturnItemResponse> lineItems,
        Instant createdAt,
        Instant updatedAt
) {
}
