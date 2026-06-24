package com.mss301.notification.repository;

import com.mss301.notification.entity.BusinessPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BusinessPolicyRepository extends JpaRepository<BusinessPolicy, UUID> {

    boolean existsByCode(String code);
}
