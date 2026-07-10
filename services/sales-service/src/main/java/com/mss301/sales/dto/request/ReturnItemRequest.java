package com.mss301.sales.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ReturnItemRequest(
        @Size(max = 40) String productCode,
        @Size(max = 200) String productName,
        BigDecimal unitPrice,
        @NotNull @Positive Integer quantity,
        BigDecimal lineTotal
) {
}
