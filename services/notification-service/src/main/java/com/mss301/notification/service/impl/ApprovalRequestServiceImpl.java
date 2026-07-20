package com.mss301.notification.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.notification.dto.request.ApprovalRequestRequest;
import com.mss301.notification.dto.response.ApprovalRequestResponse;
import com.mss301.notification.entity.ApprovalRequest;
import com.mss301.notification.mapper.NotificationMapper;
import com.mss301.notification.repository.ApprovalRequestRepository;
import com.mss301.notification.service.interfaces.ApprovalRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprovalRequestServiceImpl implements ApprovalRequestService {

    private final ApprovalRequestRepository approvalRequestRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalRequestResponse> list() {
        return approvalRequestRepository.findAllByOrderByReqDateDesc().stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ApprovalRequestResponse getById(UUID id) {
        return notificationMapper.toResponse(find(id));
    }

    @Override
    public ApprovalRequestResponse create(ApprovalRequestRequest request) {
        if (approvalRequestRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Approval request code already exists: " + request.code());
        }
        ApprovalRequest approvalRequest = notificationMapper.toEntity(request);
        return notificationMapper.toResponse(approvalRequestRepository.save(approvalRequest));
    }

    @Override
    public ApprovalRequestResponse update(UUID id, ApprovalRequestRequest request) {
        ApprovalRequest approvalRequest = find(id);
        if (!"Pending".equalsIgnoreCase(approvalRequest.getStatus())
                && !"Chờ duyệt".equalsIgnoreCase(approvalRequest.getStatus())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending approval requests can be edited.");
        }
        if (!approvalRequest.getCode().equals(request.code()) && approvalRequestRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Approval request code already exists: " + request.code());
        }
        notificationMapper.update(approvalRequest, request);
        return notificationMapper.toResponse(approvalRequest);
    }

    @Override
    public ApprovalRequestResponse approve(UUID id) {
        ApprovalRequest approvalRequest = find(id);
        String status = approvalRequest.getStatus() == null ? "" : approvalRequest.getStatus().toLowerCase();
        if (!status.contains("pending") && !status.contains("chờ")) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending approval requests can be approved.");
        }
        approvalRequest.setStatus("Đã duyệt");
        return notificationMapper.toResponse(approvalRequest);
    }

    @Override
    public ApprovalRequestResponse reject(UUID id) {
        ApprovalRequest approvalRequest = find(id);
        String status = approvalRequest.getStatus() == null ? "" : approvalRequest.getStatus().toLowerCase();
        if (!status.contains("pending") && !status.contains("chờ")) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending approval requests can be rejected.");
        }
        approvalRequest.setStatus("Từ chối");
        return notificationMapper.toResponse(approvalRequest);
    }

    @Override
    public void delete(UUID id) {
        approvalRequestRepository.delete(find(id));
    }

    private ApprovalRequest find(UUID id) {
        return approvalRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Approval request not found: " + id));
    }
}
