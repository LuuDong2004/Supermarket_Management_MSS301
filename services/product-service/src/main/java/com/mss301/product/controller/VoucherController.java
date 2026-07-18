package com.mss301.product.controller;

import com.mss301.product.dto.request.VoucherRequest;
import com.mss301.product.dto.response.VoucherResponse;
import com.mss301.product.service.interfaces.VoucherService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Vouchers", description = "Discount voucher endpoints")
@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @Operation(summary = "List vouchers")
    @GetMapping
    public ApiResponse<List<VoucherResponse>> getAll() {
        return ApiResponse.success(voucherService.getAll());
    }

    @Operation(summary = "Get a voucher by code")
    @GetMapping("/{code}")
    public ApiResponse<VoucherResponse> getByCode(@PathVariable String code) {
        return ApiResponse.success(voucherService.getByCode(code));
    }

    @Operation(summary = "Create a voucher")
    @PreAuthorize("hasRole('CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> create(@Valid @RequestBody VoucherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Voucher created", voucherService.create(request)));
    }

    @Operation(summary = "Delete a voucher")
    @PreAuthorize("hasRole('CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        voucherService.delete(id);
        return ApiResponse.success("Voucher deleted");
    }
}
