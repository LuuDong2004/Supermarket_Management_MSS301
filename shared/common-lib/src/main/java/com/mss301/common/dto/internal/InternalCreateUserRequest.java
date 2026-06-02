package com.mss301.common.dto.internal;

import com.mss301.common.enums.Role;

/**
 * Internal command used by auth-service to register a new user inside
 * user-service. The password arrives already hashed (BCrypt) — user-service
 * stores it verbatim and never sees the raw credential.
 */
public record InternalCreateUserRequest(
        String username,
        String email,
        String passwordHash,
        String fullName,
        String phone,
        Role role
) {
}
