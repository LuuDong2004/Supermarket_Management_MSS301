package com.mss301.inventory.controller;

import com.mss301.inventory.dto.request.StockAdjustmentRequest;
import com.mss301.inventory.dto.response.StockAdjustmentResponse;
import com.mss301.inventory.service.interfaces.StockAdjustmentService;
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

@Tag(name = "Stock Adjustments", description = "Stock adjustment endpoints")
@RestController
@RequestMapping("/api/stock-adjustments")
@RequiredArgsConstructor
public class StockAdjustmentController {

    private final StockAdjustmentService stockAdjustmentService;

    @Operation(summary = "List stock adjustments (newest first)")
    @GetMapping
    public ApiResponse<List<StockAdjustmentResponse>> findAll() {
        return ApiResponse.success(stockAdjustmentService.findAll());
    }

    @Operation(summary = "Get a stock adjustment by id")
    @GetMapping("/{id}")
    public ApiResponse<StockAdjustmentResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(stockAdjustmentService.getById(id));
    }

    @Operation(summary = "Create a stock adjustment")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<StockAdjustmentResponse>> create(@Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Stock adjustment created", stockAdjustmentService.create(request)));
    }

    @Operation(summary = "Update a stock adjustment")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<StockAdjustmentResponse> update(@PathVariable UUID id, @Valid @RequestBody StockAdjustmentRequest request) {
        return ApiResponse.success("Stock adjustment updated", stockAdjustmentService.update(id, request));
    }

    @Operation(summary = "Approve a stock adjustment")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/approve")
    public ApiResponse<StockAdjustmentResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Stock adjustment approved", stockAdjustmentService.approve(id));
    }

    @Operation(summary = "Reject a stock adjustment")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/reject")
    public ApiResponse<StockAdjustmentResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Stock adjustment rejected", stockAdjustmentService.reject(id));
    }

    @Operation(summary = "Delete a stock adjustment")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        stockAdjustmentService.delete(id);
        return ApiResponse.success("Stock adjustment deleted");
    }
}
