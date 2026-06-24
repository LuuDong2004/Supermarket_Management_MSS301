package com.mss301.notification.service.impl;

import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.notification.dto.request.NotificationRequest;
import com.mss301.notification.dto.response.NotificationResponse;
import com.mss301.notification.entity.Notification;
import com.mss301.notification.mapper.NotificationMapper;
import com.mss301.notification.repository.NotificationRepository;
import com.mss301.notification.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> list() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long unreadCount() {
        return notificationRepository.countByReadFlagFalse();
    }

    @Override
    public NotificationResponse create(NotificationRequest request) {
        Notification notification = notificationMapper.toEntity(request);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Override
    public NotificationResponse markRead(UUID id) {
        Notification notification = find(id);
        notification.setReadFlag(true);
        return notificationMapper.toResponse(notification);
    }

    @Override
    public void delete(UUID id) {
        notificationRepository.delete(find(id));
    }

    private Notification find(UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Notification not found: " + id));
    }
}
