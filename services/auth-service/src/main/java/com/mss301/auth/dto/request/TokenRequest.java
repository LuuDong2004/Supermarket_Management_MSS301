package com.mss301.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Carries a refresh token for the refresh and logout flows.
 */
public record TokenRequest(
        @NotBlank String refreshToken
) {
}
