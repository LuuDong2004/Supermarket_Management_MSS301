package com.mss301.notification.controller;

import com.mss301.notification.dto.request.ApprovalRequestRequest;
import com.mss301.notification.dto.response.ApprovalRequestResponse;
import com.mss301.notification.service.interfaces.ApprovalRequestService;
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

@Tag(name = "Approval Requests", description = "Approval request workflow endpoints")
@RestController
@RequestMapping("/api/approval-requests")
@RequiredArgsConstructor
public class ApprovalRequestController {

    private final ApprovalRequestService approvalRequestService;

    @Operation(summary = "List approval requests (newest first)")
    @GetMapping
    public ApiResponse<List<ApprovalRequestResponse>> list() {
        return ApiResponse.success(approvalRequestService.list());
    }

    @Operation(summary = "Get an approval request by id")
    @GetMapping("/{id}")
    public ApiResponse<ApprovalRequestResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(approvalRequestService.getById(id));
    }

    @Operation(summary = "Create an approval request")
    @PostMapping
    public ResponseEntity<ApiResponse<ApprovalRequestResponse>> create(@Valid @RequestBody ApprovalRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Approval request created", approvalRequestService.create(request)));
    }

    @Operation(summary = "Update an approval request")
    @PutMapping("/{id}")
    public ApiResponse<ApprovalRequestResponse> update(@PathVariable UUID id, @Valid @RequestBody ApprovalRequestRequest request) {
        return ApiResponse.success("Approval request updated", approvalRequestService.update(id, request));
    }

    @Operation(summary = "Approve a request")
    @PreAuthorize("hasRole('CEO')")
    @PostMapping("/{id}/approve")
    public ApiResponse<ApprovalRequestResponse> approve(@PathVariable UUID id) {
        return ApiResponse.success("Approval request approved", approvalRequestService.approve(id));
    }

    @Operation(summary = "Reject a request")
    @PreAuthorize("hasRole('CEO')")
    @PostMapping("/{id}/reject")
    public ApiResponse<ApprovalRequestResponse> reject(@PathVariable UUID id) {
        return ApiResponse.success("Approval request rejected", approvalRequestService.reject(id));
    }

    @Operation(summary = "Delete an approval request")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        approvalRequestService.delete(id);
        return ApiResponse.success("Approval request deleted");
    }
}
