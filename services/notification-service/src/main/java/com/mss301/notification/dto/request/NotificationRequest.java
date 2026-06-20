package com.mss301.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 512) String message,
        @NotBlank @Size(max = 20) String level,
        @NotBlank @Size(max = 80) String recipient
) {
}
