package com.mss301.notification.repository;

import com.mss301.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByReadFlagFalse();
}
