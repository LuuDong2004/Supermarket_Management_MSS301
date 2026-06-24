package com.mss301.sales.controller;

import com.mss301.sales.dto.request.ShiftRequest;
import com.mss301.sales.dto.response.ShiftResponse;
import com.mss301.sales.service.interfaces.ShiftService;
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

@Tag(name = "Shifts", description = "Cashier shift endpoints")
@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @Operation(summary = "List shifts (newest first)")
    @GetMapping
    public ApiResponse<List<ShiftResponse>> list() {
        return ApiResponse.success(shiftService.list());
    }

    @Operation(summary = "Get a shift by id")
    @GetMapping("/{id}")
    public ApiResponse<ShiftResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(shiftService.getById(id));
    }

    @Operation(summary = "Open a shift")
    @PreAuthorize("hasAnyRole('CASHIER','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<ShiftResponse>> create(@Valid @RequestBody ShiftRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Shift opened", shiftService.create(request)));
    }

    @Operation(summary = "Update a shift (e.g. close it)")
    @PreAuthorize("hasAnyRole('CASHIER','ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ShiftResponse> update(@PathVariable UUID id, @Valid @RequestBody ShiftRequest request) {
        return ApiResponse.success("Shift updated", shiftService.update(id, request));
    }

    @Operation(summary = "Delete a shift")
    @PreAuthorize("hasAnyRole('CASHIER','ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        shiftService.delete(id);
        return ApiResponse.success("Shift deleted");
    }
}
