package com.mss301.user.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AttendanceResponse(
        UUID id,
        String code,
        String employee,
        LocalDate date,
        String checkIn,
        String checkOut,
        Integer hours,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
