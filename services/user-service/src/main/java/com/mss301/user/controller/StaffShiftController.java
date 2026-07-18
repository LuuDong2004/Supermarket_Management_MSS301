package com.mss301.user.controller;

import com.mss301.response.ApiResponse;
import com.mss301.user.dto.request.StaffShiftRequest;
import com.mss301.user.dto.response.StaffShiftResponse;
import com.mss301.user.service.interfaces.StaffShiftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Tag(name = "Staff Shifts", description = "Staff shift scheduling endpoints (UC-HR-02)")
@RestController
@RequestMapping("/api/staff-shifts")
@RequiredArgsConstructor
public class StaffShiftController {

    private final StaffShiftService staffShiftService;

    @Operation(summary = "List staff shifts (optionally within a date range)")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @GetMapping
    public ApiResponse<List<StaffShiftResponse>> list(
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(staffShiftService.list(from, to));
    }

    @Operation(summary = "Get a staff shift by id")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @GetMapping("/{id}")
    public ApiResponse<StaffShiftResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(staffShiftService.getById(id));
    }

    @Operation(summary = "Assign a staff shift")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<StaffShiftResponse>> create(@Valid @RequestBody StaffShiftRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Shift assigned", staffShiftService.create(request)));
    }

    @Operation(summary = "Update a staff shift")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<StaffShiftResponse> update(@PathVariable UUID id,
                                                  @Valid @RequestBody StaffShiftRequest request) {
        return ApiResponse.success("Shift updated", staffShiftService.update(id, request));
    }

    @Operation(summary = "Mark a staff shift as completed")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @PostMapping("/{id}/complete")
    public ApiResponse<StaffShiftResponse> complete(@PathVariable UUID id) {
        return ApiResponse.success("Shift completed", staffShiftService.complete(id));
    }

    @Operation(summary = "Delete a staff shift")
    @PreAuthorize("hasRole('STAFF_MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        staffShiftService.delete(id);
        return ApiResponse.success("Shift deleted");
    }
}
