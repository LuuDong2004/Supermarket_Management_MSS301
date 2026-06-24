package com.mss301.notification.service.interfaces;

import com.mss301.notification.dto.request.BusinessPolicyRequest;
import com.mss301.notification.dto.response.BusinessPolicyResponse;

import java.util.List;
import java.util.UUID;

public interface BusinessPolicyService {

    List<BusinessPolicyResponse> list();

    BusinessPolicyResponse getById(UUID id);

    BusinessPolicyResponse create(BusinessPolicyRequest request);

    BusinessPolicyResponse update(UUID id, BusinessPolicyRequest request);

    void delete(UUID id);
}
