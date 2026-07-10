package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoodsReceiptRequest(
        @NotBlank @Size(max = 30) String code,
        @Size(max = 30) String poCode,
        @NotBlank @Size(max = 150) String supplier,
        @NotNull LocalDate receiveDate,
        @Size(max = 120) String receivedBy,
        @NotNull @PositiveOrZero Integer items,
        @NotNull @PositiveOrZero BigDecimal total,
        @Size(max = 500) String note
) {
}
