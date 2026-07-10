package com.mss301.sales.config;

import com.mss301.common.exception.ApiException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import feign.Response;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Feign configuration for calls into product-service. Attaches the shared
 * internal API key and translates downstream errors into typed exceptions so a
 * stock shortage surfaces as a 409 to the cashier.
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

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> switch (response.status()) {
            case 404 -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, readBody(response));
            case 409 -> new ConflictException(ErrorCode.CONFLICT, readBody(response));
            default -> new ApiException(ErrorCode.SERVICE_UNAVAILABLE,
                    "product-service call failed (status " + response.status() + ")");
        };
    }

    private String readBody(Response response) {
        if (response.body() == null) {
            return "product-service rejected the request";
        }
        try (InputStream is = response.body().asInputStream()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "product-service rejected the request";
        }
    }
}
