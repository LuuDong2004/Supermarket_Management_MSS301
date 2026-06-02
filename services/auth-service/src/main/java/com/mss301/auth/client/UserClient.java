package com.mss301.auth.client;

import com.mss301.auth.config.FeignClientConfig;
import com.mss301.common.dto.internal.InternalCreateUserRequest;
import com.mss301.common.dto.internal.InternalUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Calls the user-service internal API (load-balanced via Eureka). The shared
 * internal API key is attached by {@link FeignClientConfig}.
 */
@FeignClient(name = "user-service", path = "/internal/users", configuration = FeignClientConfig.class)
public interface UserClient {

    @GetMapping("/by-username/{username}")
    InternalUserResponse getByUsername(@PathVariable("username") String username);

    @PostMapping
    InternalUserResponse create(@RequestBody InternalCreateUserRequest request);
}
