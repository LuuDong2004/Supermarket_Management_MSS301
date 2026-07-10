package com.mss301.product.controller;

import com.mss301.product.dto.request.PromotionRequest;
import com.mss301.product.dto.response.PromotionResponse;
import com.mss301.product.service.interfaces.PromotionService;
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

@Tag(name = "Promotions", description = "Promotion campaign endpoints")
@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @Operation(summary = "List promotions")
    @GetMapping
    public ApiResponse<List<PromotionResponse>> getAll() {
        return ApiResponse.success(promotionService.getAll());
    }

    @Operation(summary = "Get a promotion by id")
    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(promotionService.getById(id));
    }

    @Operation(summary = "Create a promotion")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<PromotionResponse>> create(@Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Promotion created", promotionService.create(request)));
    }

    @Operation(summary = "Update a promotion")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PutMapping("/{id}")
    public ApiResponse<PromotionResponse> update(@PathVariable UUID id, @Valid @RequestBody PromotionRequest request) {
        return ApiResponse.success("Promotion updated", promotionService.update(id, request));
    }

    @Operation(summary = "Approve a promotion campaign (UC-CEO05)")
    @PreAuthorize("hasAnyRole('CEO','ADMIN')")
    @PostMapping("/{id}/approve")
    public ApiResponse<PromotionResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Promotion approved", promotionService.approve(id));
    }

    @Operation(summary = "Reject a promotion campaign (UC-CEO05)")
    @PreAuthorize("hasAnyRole('CEO','ADMIN')")
    @PostMapping("/{id}/reject")
    public ApiResponse<PromotionResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Promotion rejected", promotionService.reject(id));
    }

    @Operation(summary = "Delete a promotion")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        promotionService.delete(id);
        return ApiResponse.success("Promotion deleted");
    }
}
