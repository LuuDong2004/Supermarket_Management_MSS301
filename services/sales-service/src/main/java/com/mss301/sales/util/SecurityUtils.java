package com.mss301.sales.util;

import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.UnauthorizedException;
import com.mss301.sales.security.GatewayUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static GatewayUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof GatewayUser user)) {
            throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
        }
        return user;
    }
}
