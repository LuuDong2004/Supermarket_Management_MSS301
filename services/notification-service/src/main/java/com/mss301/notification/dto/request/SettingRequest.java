package com.mss301.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SettingRequest(
        @NotBlank @Size(max = 100) String settingKey,
        @NotBlank @Size(max = 255) String settingValue,
        @NotBlank @Size(max = 150) String label,
        @NotBlank @Size(max = 80) String category
) {
}
