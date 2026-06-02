package com.mss301.auth.controller;

import com.mss301.auth.dto.response.AuthResponse;
import com.mss301.auth.dto.request.LoginRequest;
import com.mss301.auth.dto.request.RegisterRequest;
import com.mss301.auth.dto.request.TokenRequest;
import com.mss301.auth.service.interfaces.AuthService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Login, registration and token lifecycle")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Authenticate and receive access + refresh tokens")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @Operation(summary = "Register a new account (defaults to ROLE_CASHIER)")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", authService.register(request)));
    }

    @Operation(summary = "Exchange a refresh token for a new token pair (rotation)")
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody TokenRequest request) {
        return ApiResponse.success("Token refreshed", authService.refresh(request.refreshToken()));
    }

    @Operation(summary = "Revoke a refresh token")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@Valid @RequestBody TokenRequest request) {
        authService.logout(request.refreshToken());
        return ApiResponse.success("Logged out");
    }
}
