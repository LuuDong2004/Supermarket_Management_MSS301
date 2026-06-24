package com.mss301.notification.dto.response;

import java.time.Instant;
import java.util.UUID;

public record SettingResponse(
        UUID id,
        String settingKey,
        String settingValue,
        String label,
        String category,
        Instant createdAt,
        Instant updatedAt
) {
}
