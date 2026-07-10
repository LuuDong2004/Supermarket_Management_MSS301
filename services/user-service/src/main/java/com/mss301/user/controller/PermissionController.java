package com.mss301.user.controller;

import com.mss301.response.ApiResponse;
import com.mss301.user.dto.request.FeaturePermissionRequest;
import com.mss301.user.dto.response.FeaturePermissionResponse;
import com.mss301.user.service.interfaces.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Permissions", description = "Role-based permission matrix (UC-A02)")
@RestController
@RequestMapping("/api/users/permissions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN')")
public class PermissionController {

    private final PermissionService permissionService;

    @Operation(summary = "List the role permission matrix")
    @GetMapping
    public ApiResponse<List<FeaturePermissionResponse>> list() {
        return ApiResponse.success(permissionService.list());
    }

    @Operation(summary = "Update permissions for a feature row")
    @PutMapping("/{id}")
    public ApiResponse<FeaturePermissionResponse> update(@PathVariable UUID id,
                                                         @Valid @RequestBody FeaturePermissionRequest request) {
        return ApiResponse.success("Permissions updated", permissionService.update(id, request));
    }
}
