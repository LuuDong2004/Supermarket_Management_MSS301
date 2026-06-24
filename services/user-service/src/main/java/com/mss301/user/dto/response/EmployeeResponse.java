package com.mss301.user.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String code,
        String name,
        String role,
        String dept,
        LocalDate joined,
        String phone,
        String status,
        BigDecimal salary,
        Instant createdAt,
        Instant updatedAt
) {
}
