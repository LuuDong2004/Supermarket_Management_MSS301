package com.mss301.product.controller;

import com.mss301.product.dto.request.ProductRequest;
import com.mss301.product.dto.response.ProductResponse;
import com.mss301.product.service.interfaces.ProductService;
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

import java.util.List;
import java.util.UUID;

@Tag(name = "Products", description = "Product catalog endpoints")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "List/search products")
    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ApiResponse.success(productService.search(query, category, pageable));
    }

    @Operation(summary = "List distinct categories")
    @GetMapping("/categories")
    public ApiResponse<List<String>> categories() {
        return ApiResponse.success(productService.categories());
    }

    @Operation(summary = "List products at or below a stock threshold")
    @GetMapping("/low-stock")
    public ApiResponse<List<ProductResponse>> lowStock(@RequestParam(defaultValue = "10") int threshold) {
        return ApiResponse.success(productService.lowStock(threshold));
    }

    @Operation(summary = "Get a product by id")
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(productService.getById(id));
    }

    @Operation(summary = "Create a product")
    @PreAuthorize("hasAnyRole('CEO','WAREHOUSE_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", productService.create(request)));
    }

    @Operation(summary = "Update a product")
    @PreAuthorize("hasAnyRole('CEO','WAREHOUSE_MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> update(@PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Product updated", productService.update(id, request));
    }

    @Operation(summary = "Upload a product image")
    @PreAuthorize("hasAnyRole('CEO','WAREHOUSE_MANAGER')")
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> uploadImage(@PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success("Image uploaded", productService.uploadImage(id, file));
    }

    @Operation(summary = "Delete a product")
    @PreAuthorize("hasRole('CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ApiResponse.success("Product deleted");
    }
}
