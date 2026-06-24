package com.mss301.inventory.repository;

import com.mss301.inventory.entity.StockCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockCountRepository extends JpaRepository<StockCount, UUID> {

    boolean existsByCode(String code);

    List<StockCount> findAllByOrderByCountDateDesc();
}
