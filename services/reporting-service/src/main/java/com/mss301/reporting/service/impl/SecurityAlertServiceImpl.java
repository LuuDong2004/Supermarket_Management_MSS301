package com.mss301.reporting.service.impl;

import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.reporting.dto.response.SecurityAlertResponse;
import com.mss301.reporting.entity.SecurityAlert;
import com.mss301.reporting.mapper.ReportingMapper;
import com.mss301.reporting.repository.SecurityAlertRepository;
import com.mss301.reporting.service.interfaces.SecurityAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SecurityAlertServiceImpl implements SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;
    private final ReportingMapper reportingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SecurityAlertResponse> list() {
        return securityAlertRepository.findAllByOrderByCodeDesc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public SecurityAlertResponse resolve(UUID id) {
        SecurityAlert alert = securityAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Security alert not found: " + id));
        alert.setStatus("Đã xử lý");
        return reportingMapper.toResponse(alert);
    }
}
