package com.mss301.notification.controller;

import com.mss301.notification.dto.request.BusinessPolicyRequest;
import com.mss301.notification.dto.response.BusinessPolicyResponse;
import com.mss301.notification.service.interfaces.BusinessPolicyService;
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

@Tag(name = "Business Policies", description = "Business policy endpoints")
@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class BusinessPolicyController {

    private final BusinessPolicyService businessPolicyService;

    @Operation(summary = "List business policies")
    @GetMapping
    public ApiResponse<List<BusinessPolicyResponse>> list() {
        return ApiResponse.success(businessPolicyService.list());
    }

    @Operation(summary = "Get a business policy by id")
    @GetMapping("/{id}")
    public ApiResponse<BusinessPolicyResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(businessPolicyService.getById(id));
    }

    @Operation(summary = "Create a business policy")
    @PreAuthorize("hasRole('CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<BusinessPolicyResponse>> create(@Valid @RequestBody BusinessPolicyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy created", businessPolicyService.create(request)));
    }

    @Operation(summary = "Update a business policy")
    @PreAuthorize("hasRole('CEO')")
    @PutMapping("/{id}")
    public ApiResponse<BusinessPolicyResponse> update(@PathVariable UUID id, @Valid @RequestBody BusinessPolicyRequest request) {
        return ApiResponse.success("Policy updated", businessPolicyService.update(id, request));
    }

    @Operation(summary = "Delete a business policy")
    @PreAuthorize("hasRole('CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        businessPolicyService.delete(id);
        return ApiResponse.success("Policy deleted");
    }
}
