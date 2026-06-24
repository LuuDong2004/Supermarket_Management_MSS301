package com.mss301.sales.repository;

import com.mss301.sales.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, UUID> {

    boolean existsByCode(String code);

    List<Shift> findAllByOrderByCodeDesc();
}
