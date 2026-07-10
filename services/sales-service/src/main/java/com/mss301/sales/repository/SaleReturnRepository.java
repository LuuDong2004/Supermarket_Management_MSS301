package com.mss301.sales.repository;

import com.mss301.sales.entity.SaleReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleReturnRepository extends JpaRepository<SaleReturn, UUID> {

    boolean existsByCode(String code);

    List<SaleReturn> findAllByOrderByCodeDesc();

    List<SaleReturn> findBySaleCode(String saleCode);
}
