package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SupplierRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 100) String contact,
        @Size(max = 30) String phone,
        @DecimalMin("0.0") BigDecimal rating,
        @Size(max = 30) String status,
        @Size(max = 30) String terms,
        @Size(max = 100) String email,
        @Size(max = 255) String address
) {
}
