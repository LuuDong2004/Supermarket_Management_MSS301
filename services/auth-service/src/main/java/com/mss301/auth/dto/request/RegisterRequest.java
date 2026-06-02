package com.mss301.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Public self-registration. Role is intentionally NOT accepted here — new
 * accounts default to the lowest-privilege role and are elevated by an admin.
 */
public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 150) String fullName,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "invalid phone number") String phone
) {
}
