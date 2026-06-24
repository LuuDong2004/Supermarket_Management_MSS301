package com.mss301.reporting.service.impl;

import com.mss301.reporting.dto.request.SystemLogRequest;
import com.mss301.reporting.dto.response.ServiceStatusResponse;
import com.mss301.reporting.dto.response.SystemLogResponse;
import com.mss301.reporting.entity.SystemLog;
import com.mss301.reporting.mapper.ReportingMapper;
import com.mss301.reporting.repository.ServiceStatusRepository;
import com.mss301.reporting.repository.SystemLogRepository;
import com.mss301.reporting.service.interfaces.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MonitoringServiceImpl implements MonitoringService {

    private static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ServiceStatusRepository serviceStatusRepository;
    private final SystemLogRepository systemLogRepository;
    private final ReportingMapper reportingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceStatusResponse> services() {
        return serviceStatusRepository.findAllByOrderByPortAsc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemLogResponse> logs() {
        return systemLogRepository.findAllByOrderByCodeDesc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public SystemLogResponse createLog(SystemLogRequest request) {
        SystemLog log = SystemLog.builder()
                .code(nextCode())
                .time(LocalDateTime.now().format(TIME_FORMAT))
                .level(request.level())
                .service(request.service())
                .message(request.message())
                .actor(request.actor())
                .build();
        return reportingMapper.toResponse(systemLogRepository.save(log));
    }

    private String nextCode() {
        return systemLogRepository.findAllByOrderByCodeDesc().stream()
                .map(SystemLog::getCode)
                .filter(c -> c != null && c.startsWith("L"))
                .map(c -> {
                    try {
                        return Integer.parseInt(c.substring(1));
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .max(Integer::compareTo)
                .map(max -> "L" + (max + 1))
                .orElse("L9001");
    }
}
