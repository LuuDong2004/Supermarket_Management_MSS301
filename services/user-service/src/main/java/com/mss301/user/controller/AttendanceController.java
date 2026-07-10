package com.mss301.user.controller;

import com.mss301.response.ApiResponse;
import com.mss301.user.dto.request.AttendanceRequest;
import com.mss301.user.dto.response.AttendanceResponse;
import com.mss301.user.dto.response.TimesheetRowResponse;
import com.mss301.user.service.interfaces.AttendanceService;
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

@Tag(name = "Attendance", description = "HR attendance management endpoints")
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Operation(summary = "List attendance records (optionally filter by date)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping
    public ApiResponse<List<AttendanceResponse>> getAll(
            @RequestParam(name = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(attendanceService.getAll(date));
    }

    @Operation(summary = "Aggregated timesheet report over a date range (UC-HR-03)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','WAREHOUSE_MANAGER')")
    @GetMapping("/timesheet")
    public ApiResponse<List<TimesheetRowResponse>> timesheet(
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success(attendanceService.timesheet(from, to));
    }

    @Operation(summary = "Get an attendance record by id")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping("/{id}")
    public ApiResponse<AttendanceResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(attendanceService.getById(id));
    }

    @Operation(summary = "Create an attendance record")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceResponse>> create(@Valid @RequestBody AttendanceRequest request) {
        AttendanceResponse created = attendanceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance created", created));
    }

    @Operation(summary = "Update an attendance record")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PutMapping("/{id}")
    public ApiResponse<AttendanceResponse> update(@PathVariable UUID id,
                                                  @Valid @RequestBody AttendanceRequest request) {
        return ApiResponse.success("Attendance updated", attendanceService.update(id, request));
    }

    @Operation(summary = "Soft delete an attendance record")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        attendanceService.softDelete(id);
        return ApiResponse.success("Attendance deleted");
    }
}
