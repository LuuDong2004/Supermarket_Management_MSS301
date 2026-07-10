package com.mss301.sales.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        String code,
        String saleTime,
        String cashier,
        Integer items,
        BigDecimal total,
        String payment,
        String status,
        String customerCode,
        String customerName,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal vat,
        BigDecimal amountReceived,
        BigDecimal changeGiven,
        Integer pointsEarned,
        Integer pointsRedeemed,
        List<SaleItemResponse> lineItems,
        Instant createdAt,
        Instant updatedAt
) {
}
