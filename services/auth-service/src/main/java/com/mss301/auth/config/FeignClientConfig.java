package com.mss301.auth.config;

import com.mss301.common.exception.ApiException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

/**
 * Feign configuration: attaches the shared internal API key to every outbound
 * request so user-service accepts the service-to-service call.
 *
 * <p>Not annotated with {@code @Configuration} on purpose — it is referenced
 * explicitly by the client to avoid being applied globally.
 */
public class FeignClientConfig {

    public static final String INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key";

    @Bean
    public RequestInterceptor internalApiKeyInterceptor(
            @Value("${security.internal.api-key}") String apiKey) {
        return template -> template.header(INTERNAL_API_KEY_HEADER, apiKey);
    }

    /**
     * Translates downstream HTTP errors into typed exceptions so the service
     * layer can react (e.g. map a 404 to invalid credentials on login).
     */
    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> switch (response.status()) {
            case 404 -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND);
            case 409 -> new ConflictException(ErrorCode.CONFLICT, "User already exists");
            default -> new ApiException(ErrorCode.SERVICE_UNAVAILABLE,
                    "user-service call failed (status " + response.status() + ")");
        };
    }
}
