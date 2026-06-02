package com.mss301.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 150) String fullName,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "invalid phone number") String phone
) {
}
