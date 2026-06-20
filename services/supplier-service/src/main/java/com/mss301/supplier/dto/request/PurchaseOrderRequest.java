package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PurchaseOrderRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String supplier,
        @NotNull LocalDate orderDate,
        @NotNull @PositiveOrZero Integer items,
        @NotNull @DecimalMin("0.0") BigDecimal total,
        @Size(max = 30) String status,
        @Size(max = 30) String approval
) {
}
