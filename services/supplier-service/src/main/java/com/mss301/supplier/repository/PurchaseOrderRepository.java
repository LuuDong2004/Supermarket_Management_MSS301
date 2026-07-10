package com.mss301.supplier.repository;

import com.mss301.supplier.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {

    boolean existsByCode(String code);

    List<PurchaseOrder> findAllByOrderByOrderDateDesc();

    List<PurchaseOrder> findBySupplierIgnoreCaseOrderByOrderDateDesc(String supplier);
}
