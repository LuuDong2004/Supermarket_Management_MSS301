package com.mss301.reporting.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.reporting.dto.request.StrategicDecisionRequest;
import com.mss301.reporting.dto.response.StrategicDecisionResponse;
import com.mss301.reporting.entity.StrategicDecision;
import com.mss301.reporting.mapper.ReportingMapper;
import com.mss301.reporting.repository.StrategicDecisionRepository;
import com.mss301.reporting.service.interfaces.StrategicDecisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StrategicDecisionServiceImpl implements StrategicDecisionService {

    private final StrategicDecisionRepository strategicDecisionRepository;
    private final ReportingMapper reportingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StrategicDecisionResponse> list() {
        return strategicDecisionRepository.findAllByOrderByDecisionDateDesc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StrategicDecisionResponse getById(UUID id) {
        return reportingMapper.toResponse(find(id));
    }

    @Override
    public StrategicDecisionResponse create(StrategicDecisionRequest request) {
        if (strategicDecisionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Strategic decision code already exists: " + request.code());
        }
        return reportingMapper.toResponse(strategicDecisionRepository.save(reportingMapper.toEntity(request)));
    }

    @Override
    public StrategicDecisionResponse update(UUID id, StrategicDecisionRequest request) {
        StrategicDecision decision = find(id);
        if (!decision.getCode().equals(request.code()) && strategicDecisionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Strategic decision code already exists: " + request.code());
        }
        reportingMapper.update(decision, request);
        return reportingMapper.toResponse(decision);
    }

    @Override
    public void delete(UUID id) {
        strategicDecisionRepository.delete(find(id));
    }

    private StrategicDecision find(UUID id) {
        return strategicDecisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Strategic decision not found: " + id));
    }
}
