package com.mss301.notification.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.notification.dto.request.BusinessPolicyRequest;
import com.mss301.notification.dto.response.BusinessPolicyResponse;
import com.mss301.notification.entity.BusinessPolicy;
import com.mss301.notification.mapper.NotificationMapper;
import com.mss301.notification.repository.BusinessPolicyRepository;
import com.mss301.notification.service.interfaces.BusinessPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BusinessPolicyServiceImpl implements BusinessPolicyService {

    private final BusinessPolicyRepository businessPolicyRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BusinessPolicyResponse> list() {
        return businessPolicyRepository.findAll().stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BusinessPolicyResponse getById(UUID id) {
        return notificationMapper.toResponse(find(id));
    }

    @Override
    public BusinessPolicyResponse create(BusinessPolicyRequest request) {
        if (businessPolicyRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Policy code already exists: " + request.code());
        }
        BusinessPolicy businessPolicy = notificationMapper.toEntity(request);
        return notificationMapper.toResponse(businessPolicyRepository.save(businessPolicy));
    }

    @Override
    public BusinessPolicyResponse update(UUID id, BusinessPolicyRequest request) {
        BusinessPolicy businessPolicy = find(id);
        if (!businessPolicy.getCode().equals(request.code()) && businessPolicyRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Policy code already exists: " + request.code());
        }
        notificationMapper.update(businessPolicy, request);
        return notificationMapper.toResponse(businessPolicy);
    }

    @Override
    public void delete(UUID id) {
        businessPolicyRepository.delete(find(id));
    }

    private BusinessPolicy find(UUID id) {
        return businessPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Policy not found: " + id));
    }
}
