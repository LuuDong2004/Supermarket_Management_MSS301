package com.mss301.inventory.repository;

import com.mss301.inventory.entity.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {

    boolean existsByCode(String code);

    Page<InventoryItem> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<InventoryItem> findByNameContainingIgnoreCaseOrProductCodeContainingIgnoreCase(
            String name, String productCode, Pageable pageable);

    List<InventoryItem> findByOnHandLessThanEqual(int threshold);
}
