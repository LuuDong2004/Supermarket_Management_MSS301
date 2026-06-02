package com.mss301.auth.service.impl;

import com.mss301.security.jwt.JwtProperties;
import com.mss301.auth.entity.RefreshToken;
import com.mss301.auth.repository.RefreshTokenRepository;
import com.mss301.auth.util.TokenUtils;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Persists, validates and rotates opaque refresh tokens. Only hashes are stored.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtProperties jwtProperties;

    /**
     * Issues a fresh refresh token and returns its raw value (shown to the
     * client only once).
     */
    public String issue(UUID userId, String username) {
        String raw = TokenUtils.generateOpaqueToken();
        RefreshToken token = RefreshToken.builder()
                .userId(userId)
                .username(username)
                .tokenHash(TokenUtils.sha256Hex(raw))
                .expiresAt(Instant.now().plus(jwtProperties.refreshTokenDays(), ChronoUnit.DAYS))
                .revoked(false)
                .build();
        repository.save(token);
        return raw;
    }

    /**
     * Validates a raw refresh token and rotates it: the presented token is
     * revoked and a brand new one is issued. Returns the new raw token.
     */
    public RotationResult rotate(String rawToken) {
        RefreshToken existing = repository.findByTokenHash(TokenUtils.sha256Hex(rawToken))
                .orElseThrow(() -> new UnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID));

        if (!existing.isActive()) {
            throw new UnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        existing.setRevoked(true);
        String newRaw = issue(existing.getUserId(), existing.getUsername());
        return new RotationResult(existing.getUserId(), existing.getUsername(), newRaw);
    }

    public void revoke(String rawToken) {
        repository.findByTokenHash(TokenUtils.sha256Hex(rawToken))
                .ifPresent(token -> token.setRevoked(true));
    }

    public record RotationResult(UUID userId, String username, String newRefreshToken) {
    }
}
