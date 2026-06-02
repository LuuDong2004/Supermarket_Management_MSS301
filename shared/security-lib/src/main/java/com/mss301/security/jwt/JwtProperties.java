package com.mss301.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Shared JWT settings bound from {@code security.jwt.*}. The {@code secret} MUST
 * be identical across auth-service (signs) and api-gateway (verifies).
 *
 * <p>Token-lifetime fields are only meaningful for the issuer (auth-service);
 * verifiers simply leave the defaults.
 */
@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(
        String secret,
        String issuer,
        long accessTokenMinutes,
        long refreshTokenDays
) {
    public JwtProperties {
        if (issuer == null || issuer.isBlank()) {
            issuer = "mss301";
        }
        if (accessTokenMinutes <= 0) {
            accessTokenMinutes = 15;
        }
        if (refreshTokenDays <= 0) {
            refreshTokenDays = 7;
        }
    }
}
