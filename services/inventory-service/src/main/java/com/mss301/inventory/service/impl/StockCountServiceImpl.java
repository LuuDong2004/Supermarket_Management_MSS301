package com.mss301.inventory.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.inventory.dto.request.StockCountRequest;
import com.mss301.inventory.dto.response.StockCountResponse;
import com.mss301.inventory.entity.StockCount;
import com.mss301.inventory.mapper.InventoryMapper;
import com.mss301.inventory.repository.StockCountRepository;
import com.mss301.inventory.service.interfaces.StockCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StockCountServiceImpl implements StockCountService {

    private final StockCountRepository stockCountRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public StockCountResponse create(StockCountRequest request) {
        if (stockCountRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Stock count code already exists: " + request.code());
        }
        StockCount count = inventoryMapper.toEntity(request);
        return inventoryMapper.toResponse(stockCountRepository.save(count));
    }

    @Override
    public StockCountResponse update(UUID id, StockCountRequest request) {
        StockCount count = find(id);
        if (!count.getCode().equals(request.code()) && stockCountRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Stock count code already exists: " + request.code());
        }
        inventoryMapper.update(count, request);
        return inventoryMapper.toResponse(count);
    }

    @Override
    @Transactional(readOnly = true)
    public StockCountResponse getById(UUID id) {
        return inventoryMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockCountResponse> findAll() {
        return stockCountRepository.findAllByOrderByCountDateDesc().stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        stockCountRepository.delete(find(id));
    }

    private StockCount find(UUID id) {
        return stockCountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Stock count not found: " + id));
    }
}
