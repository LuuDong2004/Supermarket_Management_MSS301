package com.mss301.product.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record VoucherRequest(
        @NotBlank @Size(max = 40) String code,
        @NotBlank @Size(max = 20) String type,
        @NotNull @DecimalMin("0.0") BigDecimal value,
        @NotNull @DecimalMin("0.0") BigDecimal minSpend,
        @NotBlank @Size(max = 150) String label
) {
}
