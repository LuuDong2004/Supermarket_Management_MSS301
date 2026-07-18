package com.mss301.common.enums;

/**
 * Platform roles. The {@code ROLE_} prefix is intentional so the value maps
 * directly onto Spring Security's {@code GrantedAuthority} convention and can
 * be used verbatim inside JWT claims.
 */
public enum Role {
    ROLE_CEO,
    ROLE_ADMIN,
    ROLE_WAREHOUSE_MANAGER,
    ROLE_WAREHOUSE_STAFF,
    ROLE_STAFF_MANAGER,
    ROLE_CASHIER;

    public String authority() {
        return name();
    }
}
