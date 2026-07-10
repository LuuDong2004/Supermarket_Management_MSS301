package com.mss301.reporting.controller;

import com.mss301.reporting.dto.response.SecurityAlertResponse;
import com.mss301.reporting.service.interfaces.SecurityAlertService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Security Alerts", description = "Security monitoring endpoints (UC-A05)")
@RestController
@RequestMapping("/api/monitoring/security-alerts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CEO')")
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    @Operation(summary = "List security alerts (newest first)")
    @GetMapping
    public ApiResponse<List<SecurityAlertResponse>> list() {
        return ApiResponse.success(securityAlertService.list());
    }

    @Operation(summary = "Mark a security alert as resolved")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/{id}/resolve")
    public ApiResponse<SecurityAlertResponse> resolve(@PathVariable UUID id) {
        return ApiResponse.success("Security alert resolved", securityAlertService.resolve(id));
    }
}
