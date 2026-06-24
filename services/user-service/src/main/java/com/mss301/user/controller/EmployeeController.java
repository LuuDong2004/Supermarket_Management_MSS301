package com.mss301.user.controller;

import com.mss301.response.ApiResponse;
import com.mss301.response.PageResponse;
import com.mss301.user.dto.request.EmployeeRequest;
import com.mss301.user.dto.response.EmployeeResponse;
import com.mss301.user.service.interfaces.EmployeeService;
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

@Tag(name = "Employees", description = "HR employee management endpoints")
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @Operation(summary = "List employees (search by name)")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping
    public ApiResponse<PageResponse<EmployeeResponse>> getAll(
            @RequestParam(name = "query", required = false) String query,
            Pageable pageable) {
        return ApiResponse.success(employeeService.getAll(query, pageable));
    }

    @Operation(summary = "Get an employee by id")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @GetMapping("/{id}")
    public ApiResponse<EmployeeResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(employeeService.getById(id));
    }

    @Operation(summary = "Create an employee")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created", created));
    }

    @Operation(summary = "Update an employee")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @PutMapping("/{id}")
    public ApiResponse<EmployeeResponse> update(@PathVariable UUID id,
                                                @Valid @RequestBody EmployeeRequest request) {
        return ApiResponse.success("Employee updated", employeeService.update(id, request));
    }

    @Operation(summary = "Soft delete an employee")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        employeeService.softDelete(id);
        return ApiResponse.success("Employee deleted");
    }
}
