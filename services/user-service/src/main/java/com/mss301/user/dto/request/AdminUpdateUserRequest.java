package com.mss301.user.dto.request;

import com.mss301.common.enums.Role;
import com.mss301.common.enums.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload used by an administrator to update another user's profile, role and
 * account status. Username, email and password are intentionally immutable here.
 */
public record AdminUpdateUserRequest(
        @NotBlank @Size(max = 150) String fullName,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "invalid phone number") String phone,
        Role role,
        UserStatus status
) {
}
