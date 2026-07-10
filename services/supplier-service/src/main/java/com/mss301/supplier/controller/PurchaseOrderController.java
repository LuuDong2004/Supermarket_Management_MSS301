package com.mss301.supplier.controller;

import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.request.ShipRequest;
import com.mss301.supplier.dto.response.PurchaseOrderResponse;
import com.mss301.supplier.service.interfaces.PurchaseOrderService;
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

@Tag(name = "Purchase Orders", description = "Purchase order endpoints")
@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @Operation(summary = "List purchase orders (newest first)")
    @GetMapping
    public ApiResponse<List<PurchaseOrderResponse>> list() {
        return ApiResponse.success(purchaseOrderService.list());
    }

    @Operation(summary = "List purchase orders addressed to the logged-in supplier")
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/mine")
    public ApiResponse<List<PurchaseOrderResponse>> listMine() {
        return ApiResponse.success(purchaseOrderService.listMine());
    }

    @Operation(summary = "Get a purchase order by id")
    @GetMapping("/{id}")
    public ApiResponse<PurchaseOrderResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(purchaseOrderService.getById(id));
    }

    @Operation(summary = "Create a purchase order")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> create(@Valid @RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase order created", purchaseOrderService.create(request)));
    }

    @Operation(summary = "Update a purchase order")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<PurchaseOrderResponse> update(@PathVariable UUID id, @Valid @RequestBody PurchaseOrderRequest request) {
        return ApiResponse.success("Purchase order updated", purchaseOrderService.update(id, request));
    }

    @Operation(summary = "Approve a purchase order")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/approve")
    public ApiResponse<PurchaseOrderResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Purchase order approved", purchaseOrderService.approve(id));
    }

    @Operation(summary = "Reject a purchase order")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/reject")
    public ApiResponse<PurchaseOrderResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Purchase order rejected", purchaseOrderService.reject(id));
    }

    @Operation(summary = "Mark a purchase order as received")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @PostMapping("/{id}/receive")
    public ApiResponse<PurchaseOrderResponse> receive(@PathVariable UUID id) {
        return ApiResponse.success("Purchase order received", purchaseOrderService.receive(id));
    }

    @Operation(summary = "Supplier confirms a purchase order")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping("/{id}/confirm")
    public ApiResponse<PurchaseOrderResponse> confirm(@PathVariable UUID id) {
        return ApiResponse.success("Đã xác nhận đơn mua", purchaseOrderService.confirmBySupplier(id));
    }

    @Operation(summary = "Supplier rejects a purchase order")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping("/{id}/reject-by-supplier")
    public ApiResponse<PurchaseOrderResponse> rejectBySupplier(@PathVariable UUID id) {
        return ApiResponse.success("Đã từ chối đơn mua", purchaseOrderService.rejectBySupplier(id));
    }

    @Operation(summary = "Supplier marks a purchase order as shipping")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping("/{id}/ship")
    public ApiResponse<PurchaseOrderResponse> ship(@PathVariable UUID id, @Valid @RequestBody(required = false) ShipRequest request) {
        return ApiResponse.success("Đã cập nhật giao hàng", purchaseOrderService.ship(id, request));
    }

    @Operation(summary = "Supplier marks a purchase order as delivered")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping("/{id}/deliver")
    public ApiResponse<PurchaseOrderResponse> deliver(@PathVariable UUID id) {
        return ApiResponse.success("Đã giao hàng", purchaseOrderService.deliver(id));
    }

    @Operation(summary = "Delete a purchase order")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        purchaseOrderService.delete(id);
        return ApiResponse.success("Purchase order deleted");
    }
}
