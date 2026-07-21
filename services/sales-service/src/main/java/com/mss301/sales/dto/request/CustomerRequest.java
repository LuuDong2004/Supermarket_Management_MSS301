package com.mss301.sales.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 20) String phone,
        @Size(max = 150) String email,
        @Size(max = 20) String tier,
        @NotNull @PositiveOrZero Integer points,
        LocalDate joined,
        @DecimalMin("0.0") BigDecimal spent,
        @Size(max = 20) String membershipStatus,
        LocalDate lastPurchase
) {
}
