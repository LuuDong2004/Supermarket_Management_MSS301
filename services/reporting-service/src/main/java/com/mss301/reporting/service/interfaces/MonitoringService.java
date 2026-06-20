package com.mss301.reporting.service.interfaces;

import com.mss301.reporting.dto.request.SystemLogRequest;
import com.mss301.reporting.dto.response.ServiceStatusResponse;
import com.mss301.reporting.dto.response.SystemLogResponse;

import java.util.List;

public interface MonitoringService {

    List<ServiceStatusResponse> services();

    List<SystemLogResponse> logs();

    SystemLogResponse createLog(SystemLogRequest request);
}
