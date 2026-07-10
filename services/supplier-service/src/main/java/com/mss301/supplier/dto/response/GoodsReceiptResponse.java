package com.mss301.supplier.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record GoodsReceiptResponse(
        UUID id,
        String code,
        String poCode,
        String supplier,
        LocalDate receiveDate,
        String receivedBy,
        Integer items,
        BigDecimal total,
        String status,
        String note
) {
}
