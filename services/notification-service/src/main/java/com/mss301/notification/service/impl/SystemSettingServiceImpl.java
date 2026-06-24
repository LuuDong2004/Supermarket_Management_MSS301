package com.mss301.notification.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.notification.dto.request.SettingRequest;
import com.mss301.notification.dto.response.SettingResponse;
import com.mss301.notification.entity.SystemSetting;
import com.mss301.notification.mapper.NotificationMapper;
import com.mss301.notification.repository.SystemSettingRepository;
import com.mss301.notification.service.interfaces.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SettingResponse> list() {
        return systemSettingRepository.findAll().stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SettingResponse getByKey(String settingKey) {
        return notificationMapper.toResponse(find(settingKey));
    }

    @Override
    public SettingResponse create(SettingRequest request) {
        if (systemSettingRepository.existsBySettingKey(request.settingKey())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Setting key already exists: " + request.settingKey());
        }
        SystemSetting systemSetting = notificationMapper.toEntity(request);
        return notificationMapper.toResponse(systemSettingRepository.save(systemSetting));
    }

    @Override
    public SettingResponse updateValue(String settingKey, String value) {
        SystemSetting systemSetting = find(settingKey);
        systemSetting.setSettingValue(value);
        return notificationMapper.toResponse(systemSetting);
    }

    private SystemSetting find(String settingKey) {
        return systemSettingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Setting not found: " + settingKey));
    }
}
