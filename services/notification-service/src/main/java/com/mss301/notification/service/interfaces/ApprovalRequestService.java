package com.mss301.notification.service.interfaces;

import com.mss301.notification.dto.request.ApprovalRequestRequest;
import com.mss301.notification.dto.response.ApprovalRequestResponse;

import java.util.List;
import java.util.UUID;

public interface ApprovalRequestService {

    List<ApprovalRequestResponse> list();

    ApprovalRequestResponse getById(UUID id);

    ApprovalRequestResponse create(ApprovalRequestRequest request);

    ApprovalRequestResponse update(UUID id, ApprovalRequestRequest request);

    ApprovalRequestResponse approve(UUID id);

    ApprovalRequestResponse reject(UUID id);

    void delete(UUID id);
}
