package com.mss301.sales.controller;

import com.mss301.sales.dto.request.CustomerRequest;
import com.mss301.sales.dto.request.PointsRequest;
import com.mss301.sales.dto.response.CustomerResponse;
import com.mss301.sales.service.interfaces.CustomerService;
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

import java.util.UUID;

@Tag(name = "Customers", description = "Membership endpoints")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "List/search customers")
    @GetMapping
    public ApiResponse<PageResponse<CustomerResponse>> search(
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return ApiResponse.success(customerService.search(query, pageable));
    }

    @Operation(summary = "Get a customer by id")
    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(customerService.getById(id));
    }

    @Operation(summary = "Get a customer by phone")
    @GetMapping("/by-phone/{phone}")
    public ApiResponse<CustomerResponse> getByPhone(@PathVariable String phone) {
        return ApiResponse.success(customerService.getByPhone(phone));
    }

    @Operation(summary = "Create a customer")
    @PreAuthorize("hasRole('CASHIER')")
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created", customerService.create(request)));
    }

    @Operation(summary = "Update a customer")
    @PreAuthorize("hasRole('CASHIER')")
    @PutMapping("/{id}")
    public ApiResponse<CustomerResponse> update(@PathVariable UUID id, @Valid @RequestBody CustomerRequest request) {
        return ApiResponse.success("Customer updated", customerService.update(id, request));
    }

    @Operation(summary = "Add or redeem loyalty points")
    @PreAuthorize("hasRole('CASHIER')")
    @PostMapping("/{id}/points")
    public ApiResponse<CustomerResponse> adjustPoints(@PathVariable UUID id, @Valid @RequestBody PointsRequest request) {
        return ApiResponse.success("Points updated", customerService.adjustPoints(id, request));
    }

    @Operation(summary = "Delete a customer")
    @PreAuthorize("hasRole('CASHIER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        customerService.delete(id);
        return ApiResponse.success("Customer deleted");
    }
}
