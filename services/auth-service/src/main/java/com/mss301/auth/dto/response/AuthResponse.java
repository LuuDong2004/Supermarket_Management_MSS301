package com.mss301.auth.dto.response;

import com.mss301.common.enums.Role;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        String userId,
        String username,
        Role role
) {
    public static AuthResponse of(String accessToken, String refreshToken, long expiresIn,
                                  String userId, String username, Role role) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresIn, userId, username, role);
    }
}
