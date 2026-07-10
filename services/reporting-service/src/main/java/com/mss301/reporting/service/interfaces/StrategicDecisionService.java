package com.mss301.reporting.service.interfaces;

import com.mss301.reporting.dto.request.StrategicDecisionRequest;
import com.mss301.reporting.dto.response.StrategicDecisionResponse;

import java.util.List;
import java.util.UUID;

public interface StrategicDecisionService {

    List<StrategicDecisionResponse> list();

    StrategicDecisionResponse getById(UUID id);

    StrategicDecisionResponse create(StrategicDecisionRequest request);

    StrategicDecisionResponse update(UUID id, StrategicDecisionRequest request);

    void delete(UUID id);
}
