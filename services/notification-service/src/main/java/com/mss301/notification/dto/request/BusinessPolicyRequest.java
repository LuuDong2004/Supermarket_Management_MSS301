package com.mss301.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record BusinessPolicyRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 150) String value,
        @NotBlank @Size(max = 80) String category,
        @NotNull LocalDate updatedDate
) {
}
