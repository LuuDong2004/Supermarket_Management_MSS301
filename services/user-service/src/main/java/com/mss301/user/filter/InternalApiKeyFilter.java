package com.mss301.user.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mss301.response.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Defence-in-depth for /internal/** endpoints. These paths are not routed by
 * the gateway, but service-to-service callers must still present the shared key.
 */
public class InternalApiKeyFilter extends OncePerRequestFilter {

    public static final String HEADER = "X-Internal-Api-Key";

    private final String expectedKey;
    private final ObjectMapper objectMapper;

    public InternalApiKeyFilter(String expectedKey, ObjectMapper objectMapper) {
        this.expectedKey = expectedKey;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/internal/");
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String provided = request.getHeader(HEADER);
        if (!StringUtils.hasText(provided) || !expectedKey.equals(provided)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getWriter(),
                    ApiResponse.error("Invalid internal API key"));
            return;
        }
        filterChain.doFilter(request, response);
    }
}
