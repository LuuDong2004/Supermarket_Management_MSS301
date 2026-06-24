package com.mss301.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ApprovalRequestRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 80) String type,
        @NotBlank @Size(max = 150) String requester,
        @NotBlank @Size(max = 150) String target,
        @NotNull LocalDate reqDate,
        @NotBlank @Size(max = 30) String status,
        @Size(max = 512) String note
) {
}
