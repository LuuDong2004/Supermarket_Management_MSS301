package com.mss301.inventory.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.inventory.dto.request.InventoryItemRequest;
import com.mss301.inventory.dto.response.InventoryItemResponse;
import com.mss301.inventory.entity.InventoryItem;
import com.mss301.inventory.mapper.InventoryMapper;
import com.mss301.inventory.repository.InventoryItemRepository;
import com.mss301.inventory.service.interfaces.InventoryItemService;
import com.mss301.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryItemServiceImpl implements InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public InventoryItemResponse create(InventoryItemRequest request) {
        if (inventoryItemRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Inventory code already exists: " + request.code());
        }
        InventoryItem item = inventoryMapper.toEntity(request);
        return inventoryMapper.toResponse(inventoryItemRepository.save(item));
    }

    @Override
    public InventoryItemResponse update(UUID id, InventoryItemRequest request) {
        InventoryItem item = find(id);
        if (!item.getCode().equals(request.code()) && inventoryItemRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Inventory code already exists: " + request.code());
        }
        inventoryMapper.update(item, request);
        return inventoryMapper.toResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryItemResponse getById(UUID id) {
        return inventoryMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<InventoryItemResponse> search(String query, String category, Pageable pageable) {
        Page<InventoryItem> page;
        if (StringUtils.hasText(query)) {
            page = inventoryItemRepository.findByNameContainingIgnoreCaseOrProductCodeContainingIgnoreCase(query, query, pageable);
        } else if (StringUtils.hasText(category)) {
            page = inventoryItemRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            page = inventoryItemRepository.findAll(pageable);
        }
        Page<InventoryItemResponse> mapped = page.map(inventoryMapper::toResponse);
        return PageResponse.of(mapped.getContent(), mapped.getNumber(), mapped.getSize(),
                mapped.getTotalElements(), mapped.getTotalPages(), mapped.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemResponse> lowStock(int threshold) {
        return inventoryItemRepository.findByOnHandLessThanEqual(threshold).stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        inventoryItemRepository.delete(find(id));
    }

    private InventoryItem find(UUID id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Inventory item not found: " + id));
    }
}
