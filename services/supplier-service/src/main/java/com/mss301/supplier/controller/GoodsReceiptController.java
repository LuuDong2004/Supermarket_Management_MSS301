package com.mss301.supplier.controller;

import com.mss301.supplier.dto.request.GoodsReceiptRequest;
import com.mss301.supplier.dto.response.GoodsReceiptResponse;
import com.mss301.supplier.service.interfaces.GoodsReceiptService;
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

@Tag(name = "Goods Receipts", description = "Goods receipt note endpoints (UC-W01/W06/M05)")
@RestController
@RequestMapping("/api/goods-receipts")
@RequiredArgsConstructor
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    @Operation(summary = "List goods receipts (newest first)")
    @GetMapping
    public ApiResponse<List<GoodsReceiptResponse>> list() {
        return ApiResponse.success(goodsReceiptService.list());
    }

    @Operation(summary = "Get a goods receipt by id")
    @GetMapping("/{id}")
    public ApiResponse<GoodsReceiptResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(goodsReceiptService.getById(id));
    }

    @Operation(summary = "Create a goods receipt (warehouse staff)")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> create(@Valid @RequestBody GoodsReceiptRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Goods receipt created", goodsReceiptService.create(request)));
    }

    @Operation(summary = "Update a goods receipt")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<GoodsReceiptResponse> update(@PathVariable UUID id, @Valid @RequestBody GoodsReceiptRequest request) {
        return ApiResponse.success("Goods receipt updated", goodsReceiptService.update(id, request));
    }

    @Operation(summary = "Approve a goods receipt (warehouse manager)")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/approve")
    public ApiResponse<GoodsReceiptResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Goods receipt approved", goodsReceiptService.approve(id));
    }

    @Operation(summary = "Reject a goods receipt (warehouse manager)")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/reject")
    public ApiResponse<GoodsReceiptResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Goods receipt rejected", goodsReceiptService.reject(id));
    }

    @Operation(summary = "Delete a goods receipt")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        goodsReceiptService.delete(id);
        return ApiResponse.success("Goods receipt deleted");
    }
}
