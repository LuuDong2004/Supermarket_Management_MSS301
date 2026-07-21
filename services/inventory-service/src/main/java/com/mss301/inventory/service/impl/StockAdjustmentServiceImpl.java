package com.mss301.inventory.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.inventory.dto.request.StockAdjustmentRequest;
import com.mss301.inventory.dto.response.StockAdjustmentResponse;
import com.mss301.inventory.entity.InventoryItem;
import com.mss301.inventory.entity.StockAdjustment;
import com.mss301.inventory.mapper.InventoryMapper;
import com.mss301.inventory.repository.InventoryItemRepository;
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

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";

    private final StockAdjustmentRepository stockAdjustmentRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public StockAdjustmentResponse create(StockAdjustmentRequest request) {
        validate(request);
        if (stockAdjustmentRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Adjustment code already exists: " + request.code());
        }
        StockAdjustment adjustment = inventoryMapper.toEntity(request);
        // A new request always starts pending; only a manager approval applies it to stock.
        adjustment.setStatus(STATUS_PENDING);
        return inventoryMapper.toResponse(stockAdjustmentRepository.save(adjustment));
    }

    @Override
    public StockAdjustmentResponse update(UUID id, StockAdjustmentRequest request) {
        StockAdjustment adjustment = find(id);
        if (!STATUS_PENDING.equals(adjustment.getStatus())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending stock adjustments can be edited.");
        }
        validate(request);
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
        if (!STATUS_PENDING.equals(adjustment.getStatus())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending stock adjustments can be approved.");
        }
        // Apply the counted quantity as the new official on-hand stock.
        // Setting on-hand to the absolute counted value keeps approval idempotent.
        inventoryItemRepository.findFirstByNameIgnoreCase(adjustment.getProduct())
                .ifPresent(item -> item.setOnHand(adjustment.getCountedQty()));
        adjustment.setStatus(STATUS_APPROVED);
        adjustment.setDecisionComment("Approved by warehouse manager; inventory quantity updated.");
        return inventoryMapper.toResponse(adjustment);
    }

    @Override
    public StockAdjustmentResponse reject(UUID id) {
        StockAdjustment adjustment = find(id);
        if (!STATUS_PENDING.equals(adjustment.getStatus())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Only pending stock adjustments can be rejected.");
        }
        adjustment.setStatus(STATUS_REJECTED);
        adjustment.setDecisionComment("Rejected by warehouse manager.");
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

    private void validate(StockAdjustmentRequest request) {
        if (request.systemQty() < 0 || request.countedQty() < 0) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Inventory quantities cannot be negative.");
        }
        if (request.diff() != request.countedQty() - request.systemQty()) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Adjustment difference must equal counted quantity minus system quantity.");
        }
    }
}
