package com.mss301.auth.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/**
 * Generates cryptographically strong opaque tokens and their SHA-256 hashes.
 */
public final class TokenUtils {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();

    private TokenUtils() {
    }

    /** A 256-bit URL-safe random token. */
    public static String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return URL_ENCODER.encodeToString(bytes);
    }

    /** SHA-256 hex digest — what we persist instead of the raw token. */
    public static String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
