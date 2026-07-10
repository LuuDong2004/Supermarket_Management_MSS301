package com.mss301.user.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record StaffShiftResponse(
        UUID id,
        String code,
        String employeeCode,
        String employeeName,
        LocalDate shiftDate,
        String shiftType,
        String startTime,
        String endTime,
        String area,
        String note,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
