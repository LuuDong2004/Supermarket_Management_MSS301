package com.mss301.user.dto.request;

import com.mss301.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload used by an administrator to provision a user directly (raw password,
 * hashed by user-service).
 */
public record CreateUserRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 150) String fullName,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "invalid phone number") String phone,
        @NotNull Role role
) {
}
