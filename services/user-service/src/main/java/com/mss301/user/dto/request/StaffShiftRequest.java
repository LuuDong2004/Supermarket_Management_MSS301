package com.mss301.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StaffShiftRequest(
        @Size(max = 40) String code,
        @Size(max = 50) String employeeCode,
        @NotBlank @Size(max = 150) String employeeName,
        @NotNull LocalDate shiftDate,
        @NotBlank @Size(max = 20) String shiftType,
        @Size(max = 10) String startTime,
        @Size(max = 10) String endTime,
        @Size(max = 100) String area,
        @Size(max = 255) String note,
        @Size(max = 20) String status
) {
}
