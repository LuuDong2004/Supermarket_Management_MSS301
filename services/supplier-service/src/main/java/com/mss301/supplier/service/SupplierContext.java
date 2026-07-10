package com.mss301.supplier.service;

import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.supplier.entity.Supplier;
import com.mss301.supplier.repository.SupplierRepository;
import com.mss301.supplier.security.GatewayUser;
import com.mss301.supplier.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Resolves the Supplier record owned by the currently authenticated
 * ROLE_SUPPLIER account (linked via {@code suppliers.account_username}).
 */
@Component
@RequiredArgsConstructor
public class SupplierContext {

    private final SupplierRepository supplierRepository;

    public Supplier current() {
        GatewayUser user = SecurityUtils.currentUser();
        return supplierRepository.findByAccountUsername(user.username())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Tài khoản chưa được liên kết với nhà cung cấp nào."));
    }
}
