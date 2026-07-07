package com.mss301.supplier.controller;

import com.mss301.supplier.dto.request.SupplierRequest;
import com.mss301.supplier.dto.response.SupplierResponse;
import com.mss301.supplier.service.interfaces.SupplierService;
import com.mss301.response.ApiResponse;
import com.mss301.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Tag(name = "Suppliers", description = "Supplier directory endpoints")
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @Operation(summary = "List/search suppliers")
    @GetMapping
    public ApiResponse<PageResponse<SupplierResponse>> search(
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return ApiResponse.success(supplierService.search(query, pageable));
    }

    @Operation(summary = "Get a supplier by id")
    @GetMapping("/{id}")
    public ApiResponse<SupplierResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(supplierService.getById(id));
    }

    @Operation(summary = "Create a supplier")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<SupplierResponse>> create(@Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplier created", supplierService.create(request)));
    }

    @Operation(summary = "Update a supplier")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PutMapping("/{id}")
    public ApiResponse<SupplierResponse> update(@PathVariable UUID id, @Valid @RequestBody SupplierRequest request) {
        return ApiResponse.success("Supplier updated", supplierService.update(id, request));
    }

    @Operation(summary = "Upload a supplier logo image")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<SupplierResponse> uploadImage(@PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success("Image uploaded", supplierService.uploadImage(id, file));
    }

    @Operation(summary = "Delete a supplier")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        supplierService.delete(id);
        return ApiResponse.success("Supplier deleted");
    }
}
