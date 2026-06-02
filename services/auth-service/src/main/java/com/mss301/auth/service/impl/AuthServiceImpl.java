package com.mss301.auth.service.impl;

import com.mss301.auth.client.UserClient;
import com.mss301.auth.dto.response.AuthResponse;
import com.mss301.auth.dto.request.LoginRequest;
import com.mss301.auth.dto.request.RegisterRequest;
import com.mss301.auth.service.interfaces.AuthService;
import com.mss301.security.jwt.JwtTokenProvider;
import com.mss301.common.dto.internal.InternalCreateUserRequest;
import com.mss301.common.dto.internal.InternalUserResponse;
import com.mss301.common.enums.Role;
import com.mss301.common.enums.UserStatus;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserClient userClient;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        InternalUserResponse user;
        try {
            user = userClient.getByUsername(request.username());
        } catch (ResourceNotFoundException ex) {
            // Do not reveal whether the username exists.
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (user.status() != UserStatus.ACTIVE) {
            throw new UnauthorizedException(ErrorCode.ACCOUNT_DISABLED);
        }

        return issueTokens(UUID.fromString(user.id()), user.username(), user.role());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        var command = new InternalCreateUserRequest(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.fullName(),
                request.phone(),
                Role.ROLE_CASHIER // lowest privilege for public registration
        );
        InternalUserResponse created = userClient.create(command);
        log.info("Registered new user '{}' ({})", created.username(), created.id());
        return issueTokens(UUID.fromString(created.id()), created.username(), created.role());
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        RefreshTokenService.RotationResult rotation = refreshTokenService.rotate(refreshToken);

        InternalUserResponse user = userClient.getByUsername(rotation.username());
        if (user.status() != UserStatus.ACTIVE) {
            throw new UnauthorizedException(ErrorCode.ACCOUNT_DISABLED);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.id(), user.username(), user.role().authority());
        return AuthResponse.of(accessToken, rotation.newRefreshToken(),
                jwtTokenProvider.accessTokenTtlSeconds(), user.id(), user.username(), user.role());
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private AuthResponse issueTokens(UUID userId, String username, Role role) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                userId.toString(), username, role.authority());
        String refreshToken = refreshTokenService.issue(userId, username);
        return AuthResponse.of(accessToken, refreshToken,
                jwtTokenProvider.accessTokenTtlSeconds(), userId.toString(), username, role);
    }
}
