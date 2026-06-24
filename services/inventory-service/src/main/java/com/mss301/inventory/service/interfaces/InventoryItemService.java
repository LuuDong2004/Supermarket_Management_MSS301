package com.mss301.inventory.service.interfaces;

import com.mss301.inventory.dto.request.InventoryItemRequest;
import com.mss301.inventory.dto.response.InventoryItemResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface InventoryItemService {

    InventoryItemResponse create(InventoryItemRequest request);

    InventoryItemResponse update(UUID id, InventoryItemRequest request);

    InventoryItemResponse getById(UUID id);

    PageResponse<InventoryItemResponse> search(String query, String category, Pageable pageable);

    List<InventoryItemResponse> lowStock(int threshold);

    void delete(UUID id);
}
