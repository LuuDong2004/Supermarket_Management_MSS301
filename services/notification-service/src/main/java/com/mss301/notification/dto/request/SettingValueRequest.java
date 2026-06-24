package com.mss301.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SettingValueRequest(
        @NotBlank @Size(max = 255) String value
) {
}
