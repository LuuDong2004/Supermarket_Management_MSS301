package com.mss301.notification.controller;

import com.mss301.notification.dto.request.SettingRequest;
import com.mss301.notification.dto.request.SettingValueRequest;
import com.mss301.notification.dto.response.SettingResponse;
import com.mss301.notification.service.interfaces.SystemSettingService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "System Settings", description = "System setting endpoints")
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @Operation(summary = "List system settings")
    @GetMapping
    public ApiResponse<List<SettingResponse>> list() {
        return ApiResponse.success(systemSettingService.list());
    }

    @Operation(summary = "Get a system setting by key")
    @GetMapping("/{key}")
    public ApiResponse<SettingResponse> getByKey(@PathVariable String key) {
        return ApiResponse.success(systemSettingService.getByKey(key));
    }

    @Operation(summary = "Create a system setting")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<SettingResponse>> create(@Valid @RequestBody SettingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Setting created", systemSettingService.create(request)));
    }

    @Operation(summary = "Update a system setting value")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{key}")
    public ApiResponse<SettingResponse> updateValue(@PathVariable String key, @Valid @RequestBody SettingValueRequest request) {
        return ApiResponse.success("Setting updated", systemSettingService.updateValue(key, request.value()));
    }
}
