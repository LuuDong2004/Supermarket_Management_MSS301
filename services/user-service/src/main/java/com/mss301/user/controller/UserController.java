package com.mss301.user.controller;

import com.mss301.response.ApiResponse;
import com.mss301.response.PageResponse;
import com.mss301.user.dto.request.AdminUpdateUserRequest;
import com.mss301.user.dto.request.ChangePasswordRequest;
import com.mss301.user.dto.request.CreateUserRequest;
import com.mss301.user.dto.request.UpdateProfileRequest;
import com.mss301.user.dto.response.UserResponse;
import com.mss301.user.service.interfaces.UserService;
import com.mss301.user.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(name = "Users", description = "User management endpoints")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Create a user (admin)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created", created));
    }

    @Operation(summary = "Get the current authenticated user")
    @GetMapping("/me")
    public ApiResponse<UserResponse> me() {
        UUID id = SecurityUtils.currentUser().uuid();
        return ApiResponse.success(userService.getById(id));
    }

    @Operation(summary = "Update the current user's profile")
    @PutMapping("/me")
    public ApiResponse<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UUID id = SecurityUtils.currentUser().uuid();
        return ApiResponse.success("Profile updated", userService.updateProfile(id, request));
    }

    @Operation(summary = "Change the current user's password")
    @PutMapping("/me/password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        UUID id = SecurityUtils.currentUser().uuid();
        userService.changePassword(id, request);
        return ApiResponse.success("Password changed");
    }

    @Operation(summary = "List all users (admin)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getAll(Pageable pageable) {
        return ApiResponse.success(userService.getAllUsers(pageable));
    }

    @Operation(summary = "Get a user by id (admin)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(userService.getById(id));
    }

    @Operation(summary = "Update a user (admin)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(@PathVariable UUID id,
                                            @Valid @RequestBody AdminUpdateUserRequest request) {
        return ApiResponse.success("User updated", userService.updateUser(id, request));
    }

    @Operation(summary = "Soft delete a user (admin)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        userService.softDelete(id);
        return ApiResponse.success("User deleted");
    }
}
