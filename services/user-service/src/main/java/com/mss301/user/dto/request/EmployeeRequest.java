package com.mss301.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        // Optional — auto-generated (EMP-####) when blank.
        @Size(max = 50) String code,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 40) String role,
        @Size(max = 100) String dept,
        LocalDate joined,
        @Size(max = 20) String phone,
        @Size(max = 30) String status,
        BigDecimal salary
) {
}
