package com.mss301.inventory.controller;

import com.mss301.inventory.dto.request.WarehouseTransactionRequest;
import com.mss301.inventory.dto.response.WarehouseTransactionResponse;
import com.mss301.inventory.service.interfaces.WarehouseTransactionService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Warehouse Transactions", description = "Warehouse transaction endpoints")
@RestController
@RequestMapping("/api/warehouse-transactions")
@RequiredArgsConstructor
public class WarehouseTransactionController {

    private final WarehouseTransactionService warehouseTransactionService;

    @Operation(summary = "List warehouse transactions (newest first)")
    @GetMapping
    public ApiResponse<List<WarehouseTransactionResponse>> findAll() {
        return ApiResponse.success(warehouseTransactionService.findAll());
    }

    @Operation(summary = "Get a warehouse transaction by id")
    @GetMapping("/{id}")
    public ApiResponse<WarehouseTransactionResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(warehouseTransactionService.getById(id));
    }

    @Operation(summary = "Create a warehouse transaction")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<WarehouseTransactionResponse>> create(@Valid @RequestBody WarehouseTransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Warehouse transaction created", warehouseTransactionService.create(request)));
    }

    @Operation(summary = "Update a warehouse transaction")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<WarehouseTransactionResponse> update(@PathVariable UUID id, @Valid @RequestBody WarehouseTransactionRequest request) {
        return ApiResponse.success("Warehouse transaction updated", warehouseTransactionService.update(id, request));
    }

    @Operation(summary = "Approve a warehouse transaction")
    @PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/approve")
    public ApiResponse<WarehouseTransactionResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Warehouse transaction approved", warehouseTransactionService.approve(id));
    }

    @Operation(summary = "Reject a warehouse transaction")
    @PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/reject")
    public ApiResponse<WarehouseTransactionResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Warehouse transaction rejected", warehouseTransactionService.reject(id));
    }

    @Operation(summary = "Delete a warehouse transaction")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        warehouseTransactionService.delete(id);
        return ApiResponse.success("Warehouse transaction deleted");
    }
}
