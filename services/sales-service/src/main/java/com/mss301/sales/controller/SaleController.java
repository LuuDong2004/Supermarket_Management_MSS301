package com.mss301.sales.controller;

import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.service.interfaces.SaleService;
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

@Tag(name = "Sales", description = "Sales / invoice endpoints")
@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @Operation(summary = "List sales (newest first)")
    @GetMapping
    public ApiResponse<List<SaleResponse>> list() {
        return ApiResponse.success(saleService.list());
    }

    @Operation(summary = "Get a sale by id")
    @GetMapping("/{id}")
    public ApiResponse<SaleResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(saleService.getById(id));
    }

    @Operation(summary = "Create a sale")
    @PreAuthorize("hasAnyRole('CASHIER','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponse>> create(@Valid @RequestBody SaleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sale created", saleService.create(request)));
    }

    @Operation(summary = "Delete a sale")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        saleService.delete(id);
        return ApiResponse.success("Sale deleted");
    }
}
