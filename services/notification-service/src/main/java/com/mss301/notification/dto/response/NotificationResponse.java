package com.mss301.notification.dto.response;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String message,
        String level,
        String recipient,
        boolean readFlag,
        Instant createdAt,
        Instant updatedAt
) {
}
