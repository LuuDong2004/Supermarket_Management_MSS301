package com.mss301.common.dto.internal;

import com.mss301.common.enums.Role;
import com.mss301.common.enums.UserStatus;

/**
 * Internal projection of a user shared across the service boundary
 * (user-service -> auth-service). Includes the password hash because
 * auth-service is responsible for credential verification.
 *
 * <p>NOTE: this DTO must never be exposed on a public/gateway-routed endpoint.
 */
public record InternalUserResponse(
        String id,
        String username,
        String email,
        String fullName,
        String phone,
        String passwordHash,
        Role role,
        UserStatus status
) {
}
