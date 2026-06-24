package com.mss301.supplier.filter;

import com.mss301.supplier.security.GatewayUser;
import com.mss301.security.constant.GatewayHeaders;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Builds the {@link org.springframework.security.core.Authentication} from the
 * identity headers injected by the gateway. The service trusts these because
 * the gateway is the only ingress and it strips spoofed copies.
 */
public class HeaderAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String userId = request.getHeader(GatewayHeaders.USER_ID);
        String username = request.getHeader(GatewayHeaders.USERNAME);
        String roles = request.getHeader(GatewayHeaders.ROLES);

        if (StringUtils.hasText(userId) && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> authorities = StringUtils.hasText(roles)
                    ? Arrays.stream(roles.split(","))
                        .map(String::trim)
                        .filter(StringUtils::hasText)
                        .map(SimpleGrantedAuthority::new)
                        .toList()
                    : List.of();

            var principal = new GatewayUser(userId, username);
            var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
