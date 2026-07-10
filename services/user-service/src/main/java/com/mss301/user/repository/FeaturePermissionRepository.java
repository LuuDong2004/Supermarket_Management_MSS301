package com.mss301.user.repository;

import com.mss301.user.entity.FeaturePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeaturePermissionRepository extends JpaRepository<FeaturePermission, UUID> {

    List<FeaturePermission> findAllByOrderBySeqAsc();
}
