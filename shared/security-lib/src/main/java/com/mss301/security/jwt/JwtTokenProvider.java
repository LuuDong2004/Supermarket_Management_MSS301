package com.mss301.security.jwt;

import com.mss301.security.constant.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Single source of truth for issuing and validating access tokens. Used by
 * auth-service (issue) and api-gateway (validate), removing the duplicated
 * key-building and parsing logic that previously lived in both.
 */
@Component
public class JwtTokenProvider {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtTokenProvider(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    /** Issues a signed access token. {@code roles} is a CSV of authorities. */
    public String generateAccessToken(String userId, String username, String roles) {
        Instant now = Instant.now();
        Instant expiry = now.plus(properties.accessTokenMinutes(), ChronoUnit.MINUTES);
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(userId)
                .claim(SecurityConstants.CLAIM_USERNAME, username)
                .claim(SecurityConstants.CLAIM_ROLES, roles)
                .claim(SecurityConstants.CLAIM_TYPE, SecurityConstants.TOKEN_TYPE_ACCESS)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    /**
     * Parses and validates the token, returning its claims.
     *
     * @throws io.jsonwebtoken.JwtException if invalid, expired or tampered.
     */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isAccessToken(Claims claims) {
        return SecurityConstants.TOKEN_TYPE_ACCESS.equals(claims.get(SecurityConstants.CLAIM_TYPE, String.class));
    }

    public long accessTokenTtlSeconds() {
        return properties.accessTokenMinutes() * 60;
    }
}
