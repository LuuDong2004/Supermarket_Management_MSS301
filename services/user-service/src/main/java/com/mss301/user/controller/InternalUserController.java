package com.mss301.user.controller;

import com.mss301.common.dto.internal.InternalCreateUserRequest;
import com.mss301.common.dto.internal.InternalUserResponse;
import com.mss301.user.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Service-to-service endpoints. NOT routed by the gateway and protected by the
 * internal API key — used exclusively by auth-service.
 */
@Hidden
@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    @GetMapping("/by-username/{username}")
    public InternalUserResponse byUsername(@PathVariable String username) {
        return userService.getByUsernameInternal(username);
    }

    @PostMapping
    public ResponseEntity<InternalUserResponse> create(@RequestBody InternalCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createInternal(request));
    }
}
