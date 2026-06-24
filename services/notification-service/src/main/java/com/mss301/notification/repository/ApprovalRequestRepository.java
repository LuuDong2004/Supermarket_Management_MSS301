package com.mss301.notification.repository;

import com.mss301.notification.entity.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, UUID> {

    boolean existsByCode(String code);

    List<ApprovalRequest> findAllByOrderByReqDateDesc();
}
