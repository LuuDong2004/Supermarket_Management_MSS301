package com.mss301.reporting.controller;

import com.mss301.reporting.dto.request.SystemLogRequest;
import com.mss301.reporting.dto.response.ServiceStatusResponse;
import com.mss301.reporting.dto.response.SystemLogResponse;
import com.mss301.reporting.service.interfaces.MonitoringService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Monitoring", description = "Service health and system log endpoints")
@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CEO')")
public class MonitoringController {

    private final MonitoringService monitoringService;

    @Operation(summary = "List service statuses")
    @GetMapping("/services")
    public ApiResponse<List<ServiceStatusResponse>> services() {
        return ApiResponse.success(monitoringService.services());
    }

    @Operation(summary = "List system logs (newest first)")
    @GetMapping("/logs")
    public ApiResponse<List<SystemLogResponse>> logs() {
        return ApiResponse.success(monitoringService.logs());
    }

    @Operation(summary = "Create a system log entry")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/logs")
    public ResponseEntity<ApiResponse<SystemLogResponse>> createLog(@Valid @RequestBody SystemLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Log created", monitoringService.createLog(request)));
    }
}
