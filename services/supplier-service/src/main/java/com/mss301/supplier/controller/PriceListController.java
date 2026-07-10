package com.mss301.supplier.controller;

import com.mss301.response.ApiResponse;
import com.mss301.supplier.dto.request.SupplierPriceItemRequest;
import com.mss301.supplier.dto.response.SupplierPriceItemResponse;
import com.mss301.supplier.service.interfaces.PriceListService;
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

@Tag(name = "Price Lists", description = "Supplier catalog / price list (own supplier only)")
@RestController
@RequestMapping("/api/price-lists")
@RequiredArgsConstructor
public class PriceListController {

    private final PriceListService priceListService;

    @Operation(summary = "List the logged-in supplier's price items")
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/mine")
    public ApiResponse<List<SupplierPriceItemResponse>> listMine() {
        return ApiResponse.success(priceListService.listMine());
    }

    @Operation(summary = "Add a price item to the supplier's catalog")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping
    public ResponseEntity<ApiResponse<SupplierPriceItemResponse>> create(@Valid @RequestBody SupplierPriceItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đã thêm báo giá", priceListService.create(request)));
    }

    @Operation(summary = "Update a price item")
    @PreAuthorize("hasRole('SUPPLIER')")
    @PutMapping("/{id}")
    public ApiResponse<SupplierPriceItemResponse> update(@PathVariable UUID id, @Valid @RequestBody SupplierPriceItemRequest request) {
        return ApiResponse.success("Đã cập nhật báo giá", priceListService.update(id, request));
    }

    @Operation(summary = "Delete a price item")
    @PreAuthorize("hasRole('SUPPLIER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        priceListService.delete(id);
        return ApiResponse.success("Đã xóa báo giá");
    }
}
