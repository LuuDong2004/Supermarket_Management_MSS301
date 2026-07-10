package com.mss301.user.service.interfaces;

import com.mss301.response.PageResponse;
import com.mss301.common.dto.internal.InternalCreateUserRequest;
import com.mss301.common.dto.internal.InternalUserResponse;
import com.mss301.user.dto.request.AdminUpdateUserRequest;
import com.mss301.user.dto.request.ChangePasswordRequest;
import com.mss301.user.dto.request.CreateUserRequest;
import com.mss301.user.dto.request.UpdateProfileRequest;
import com.mss301.user.dto.response.UserResponse;
import com.mss301.common.enums.UserStatus;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    UserResponse updateUser(UUID userId, AdminUpdateUserRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    UserResponse getById(UUID id);

    PageResponse<UserResponse> getAllUsers(Pageable pageable);

    UserResponse updateStatus(UUID id, UserStatus status);

    void softDelete(UUID id);

    // --- Internal (service-to-service) ---

    InternalUserResponse getByUsernameInternal(String username);

    InternalUserResponse createInternal(InternalCreateUserRequest request);
}
