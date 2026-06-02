package com.mss301.user.dto.response;

import com.mss301.common.enums.Role;
import com.mss301.common.enums.UserStatus;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String fullName,
        String phone,
        Role role,
        UserStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
