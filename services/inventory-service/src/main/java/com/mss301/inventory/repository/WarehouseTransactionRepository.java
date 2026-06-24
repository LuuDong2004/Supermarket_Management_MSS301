package com.mss301.inventory.repository;

import com.mss301.inventory.entity.WarehouseTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WarehouseTransactionRepository extends JpaRepository<WarehouseTransaction, UUID> {

    boolean existsByCode(String code);

    List<WarehouseTransaction> findAllByOrderByTxnDateDesc();
}
