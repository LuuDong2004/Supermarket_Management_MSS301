package com.mss301.supplier.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseOrderResponse(
        UUID id,
        String code,
        String supplier,
        LocalDate orderDate,
        Integer items,
        BigDecimal total,
        String status,
        String approval,
        String supplierStatus,
        LocalDate expectedDelivery,
        LocalDate deliveredDate,
        String supplierNote,
        Instant createdAt,
        Instant updatedAt
) {
}
