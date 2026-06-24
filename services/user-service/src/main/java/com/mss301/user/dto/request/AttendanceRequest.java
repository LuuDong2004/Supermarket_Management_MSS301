package com.mss301.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AttendanceRequest(
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 150) String employee,
        LocalDate date,
        @Size(max = 20) String checkIn,
        @Size(max = 20) String checkOut,
        Integer hours,
        @Size(max = 30) String status
) {
}
