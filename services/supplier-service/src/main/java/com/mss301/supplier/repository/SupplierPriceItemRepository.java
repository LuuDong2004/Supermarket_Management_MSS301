package com.mss301.supplier.repository;

import com.mss301.supplier.entity.SupplierPriceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupplierPriceItemRepository extends JpaRepository<SupplierPriceItem, UUID> {

    boolean existsByCode(String code);

    List<SupplierPriceItem> findBySupplierIgnoreCaseOrderByProductNameAsc(String supplier);
}
