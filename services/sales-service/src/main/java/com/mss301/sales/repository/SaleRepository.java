package com.mss301.sales.repository;

import com.mss301.sales.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    boolean existsByCode(String code);

    Optional<Sale> findByCode(String code);

    List<Sale> findAllByOrderByCodeDesc();
}
