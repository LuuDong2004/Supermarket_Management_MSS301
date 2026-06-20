package com.mss301.sales.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SaleRequest(
        @NotBlank @Size(max = 40) String code,
        @Size(max = 20) String saleTime,
        @Size(max = 120) String cashier,
        @NotNull @PositiveOrZero Integer items,
        @NotNull @DecimalMin("0.0") BigDecimal total,
        @Size(max = 30) String payment
) {
}
