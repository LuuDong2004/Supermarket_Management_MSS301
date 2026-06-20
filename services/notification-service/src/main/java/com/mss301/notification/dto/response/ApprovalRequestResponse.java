package com.mss301.notification.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ApprovalRequestResponse(
        UUID id,
        String code,
        String type,
        String requester,
        String target,
        LocalDate reqDate,
        String status,
        String note,
        Instant createdAt,
        Instant updatedAt
) {
}
