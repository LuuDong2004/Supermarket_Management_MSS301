package com.mss301.product.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductRequest(
        @NotBlank @Size(max = 30) String code,
        @Size(max = 40) String barcode,
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 80) String category,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @DecimalMin("0.0") BigDecimal cost,
        @NotNull @PositiveOrZero Integer stock,
        @Size(max = 20) String unit,
        LocalDate expiry
) {
}
