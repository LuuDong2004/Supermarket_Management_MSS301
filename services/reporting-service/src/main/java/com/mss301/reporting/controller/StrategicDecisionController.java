package com.mss301.reporting.controller;

import com.mss301.reporting.dto.request.StrategicDecisionRequest;
import com.mss301.reporting.dto.response.StrategicDecisionResponse;
import com.mss301.reporting.service.interfaces.StrategicDecisionService;
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

@Tag(name = "Strategic Decisions", description = "CEO strategic decision directives (UC-CEO07)")
@RestController
@RequestMapping("/api/reports/strategic-decisions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CEO')")
public class StrategicDecisionController {

    private final StrategicDecisionService strategicDecisionService;

    @Operation(summary = "List strategic decisions (newest first)")
    @GetMapping
    public ApiResponse<List<StrategicDecisionResponse>> list() {
        return ApiResponse.success(strategicDecisionService.list());
    }

    @Operation(summary = "Get a strategic decision by id")
    @GetMapping("/{id}")
    public ApiResponse<StrategicDecisionResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(strategicDecisionService.getById(id));
    }

    @Operation(summary = "Submit a strategic decision")
    @PreAuthorize("hasRole('CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<StrategicDecisionResponse>> create(@Valid @RequestBody StrategicDecisionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Strategic decision submitted", strategicDecisionService.create(request)));
    }

    @Operation(summary = "Update a strategic decision")
    @PreAuthorize("hasRole('CEO')")
    @PutMapping("/{id}")
    public ApiResponse<StrategicDecisionResponse> update(@PathVariable UUID id, @Valid @RequestBody StrategicDecisionRequest request) {
        return ApiResponse.success("Strategic decision updated", strategicDecisionService.update(id, request));
    }

    @Operation(summary = "Delete a strategic decision")
    @PreAuthorize("hasRole('CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        strategicDecisionService.delete(id);
        return ApiResponse.success("Strategic decision deleted");
    }
}
