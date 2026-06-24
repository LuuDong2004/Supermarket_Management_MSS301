package com.mss301.inventory.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.inventory.dto.request.StockAdjustmentRequest;
import com.mss301.inventory.dto.response.StockAdjustmentResponse;
import com.mss301.inventory.entity.StockAdjustment;
import com.mss301.inventory.mapper.InventoryMapper;
import com.mss301.inventory.repository.StockAdjustmentRepository;
import com.mss301.inventory.service.interfaces.StockAdjustmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StockAdjustmentServiceImpl implements StockAdjustmentService {

    private static final String STATUS_APPROVED = "Đã duyệt";
    private static final String STATUS_REJECTED = "Từ chối";

    private final StockAdjustmentRepository stockAdjustmentRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public StockAdjustmentResponse create(StockAdjustmentRequest request) {
        if (stockAdjustmentRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Adjustment code already exists: " + request.code());
        }
        StockAdjustment adjustment = inventoryMapper.toEntity(request);
        return inventoryMapper.toResponse(stockAdjustmentRepository.save(adjustment));
    }

    @Override
    public StockAdjustmentResponse update(UUID id, StockAdjustmentRequest request) {
        StockAdjustment adjustment = find(id);
        if (!adjustment.getCode().equals(request.code()) && stockAdjustmentRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Adjustment code already exists: " + request.code());
        }
        inventoryMapper.update(adjustment, request);
        return inventoryMapper.toResponse(adjustment);
    }

    @Override
    @Transactional(readOnly = true)
    public StockAdjustmentResponse getById(UUID id) {
        return inventoryMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockAdjustmentResponse> findAll() {
        return stockAdjustmentRepository.findAllByOrderByAdjDateDesc().stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Override
    public StockAdjustmentResponse approve(UUID id) {
        StockAdjustment adjustment = find(id);
        adjustment.setStatus(STATUS_APPROVED);
        return inventoryMapper.toResponse(adjustment);
    }

    @Override
    public StockAdjustmentResponse reject(UUID id) {
        StockAdjustment adjustment = find(id);
        adjustment.setStatus(STATUS_REJECTED);
        return inventoryMapper.toResponse(adjustment);
    }

    @Override
    public void delete(UUID id) {
        stockAdjustmentRepository.delete(find(id));
    }

    private StockAdjustment find(UUID id) {
        return stockAdjustmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Stock adjustment not found: " + id));
    }
}
