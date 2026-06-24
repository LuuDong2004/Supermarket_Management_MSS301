package com.mss301.notification.service.interfaces;

import com.mss301.notification.dto.request.NotificationRequest;
import com.mss301.notification.dto.response.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    List<NotificationResponse> list();

    long unreadCount();

    NotificationResponse create(NotificationRequest request);

    NotificationResponse markRead(UUID id);

    void delete(UUID id);
}
