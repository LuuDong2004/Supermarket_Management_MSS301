package com.mss301.inventory.controller;

import com.mss301.inventory.dto.request.InventoryItemRequest;
import com.mss301.inventory.dto.response.InventoryItemResponse;
import com.mss301.inventory.service.interfaces.InventoryItemService;
import com.mss301.response.ApiResponse;
import com.mss301.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Inventory", description = "Inventory item endpoints")
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @Operation(summary = "List/search inventory items")
    @GetMapping
    public ApiResponse<PageResponse<InventoryItemResponse>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ApiResponse.success(inventoryItemService.search(query, category, pageable));
    }

    @Operation(summary = "List items at or below a low-stock threshold")
    @GetMapping("/low-stock")
    public ApiResponse<List<InventoryItemResponse>> lowStock(@RequestParam(defaultValue = "10") int threshold) {
        return ApiResponse.success(inventoryItemService.lowStock(threshold));
    }

    @Operation(summary = "Get an inventory item by id")
    @GetMapping("/{id}")
    public ApiResponse<InventoryItemResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(inventoryItemService.getById(id));
    }

    @Operation(summary = "Create an inventory item")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<InventoryItemResponse>> create(@Valid @RequestBody InventoryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Inventory item created", inventoryItemService.create(request)));
    }

    @Operation(summary = "Update an inventory item")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<InventoryItemResponse> update(@PathVariable UUID id, @Valid @RequestBody InventoryItemRequest request) {
        return ApiResponse.success("Inventory item updated", inventoryItemService.update(id, request));
    }

    @Operation(summary = "Delete an inventory item")
    @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        inventoryItemService.delete(id);
        return ApiResponse.success("Inventory item deleted");
    }
}
