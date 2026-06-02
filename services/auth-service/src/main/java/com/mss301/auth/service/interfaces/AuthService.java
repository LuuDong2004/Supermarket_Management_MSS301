package com.mss301.auth.service.interfaces;

import com.mss301.auth.dto.response.AuthResponse;
import com.mss301.auth.dto.request.LoginRequest;
import com.mss301.auth.dto.request.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}
