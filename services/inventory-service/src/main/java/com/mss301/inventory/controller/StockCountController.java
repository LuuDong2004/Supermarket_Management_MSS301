package com.mss301.inventory.controller;

import com.mss301.inventory.dto.request.StockCountRequest;
import com.mss301.inventory.dto.response.StockCountResponse;
import com.mss301.inventory.service.interfaces.StockCountService;
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

@Tag(name = "Stock Counts", description = "Stock count endpoints")
@RestController
@RequestMapping("/api/stock-counts")
@RequiredArgsConstructor
public class StockCountController {

    private final StockCountService stockCountService;

    @Operation(summary = "List stock counts (newest first)")
    @GetMapping
    public ApiResponse<List<StockCountResponse>> findAll() {
        return ApiResponse.success(stockCountService.findAll());
    }

    @Operation(summary = "Get a stock count by id")
    @GetMapping("/{id}")
    public ApiResponse<StockCountResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(stockCountService.getById(id));
    }

    @Operation(summary = "Create a stock count")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<StockCountResponse>> create(@Valid @RequestBody StockCountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Stock count created", stockCountService.create(request)));
    }

    @Operation(summary = "Update a stock count")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<StockCountResponse> update(@PathVariable UUID id, @Valid @RequestBody StockCountRequest request) {
        return ApiResponse.success("Stock count updated", stockCountService.update(id, request));
    }

    @Operation(summary = "Delete a stock count")
    @PreAuthorize("hasAnyRole('WAREHOUSE_MANAGER','WAREHOUSE_STAFF')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        stockCountService.delete(id);
        return ApiResponse.success("Stock count deleted");
    }
}
