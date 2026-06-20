package com.mss301.reporting.repository;

import com.mss301.reporting.entity.CategoryShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryShareRepository extends JpaRepository<CategoryShare, UUID> {
}
