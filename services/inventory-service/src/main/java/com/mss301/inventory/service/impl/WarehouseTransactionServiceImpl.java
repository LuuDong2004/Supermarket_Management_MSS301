package com.mss301.inventory.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.inventory.dto.request.WarehouseTransactionRequest;
import com.mss301.inventory.dto.response.WarehouseTransactionResponse;
import com.mss301.inventory.entity.WarehouseTransaction;
import com.mss301.inventory.mapper.InventoryMapper;
import com.mss301.inventory.repository.WarehouseTransactionRepository;
import com.mss301.inventory.service.interfaces.WarehouseTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class WarehouseTransactionServiceImpl implements WarehouseTransactionService {

    private static final String STATUS_APPROVED = "Đã duyệt";
    private static final String STATUS_REJECTED = "Từ chối";

    private final WarehouseTransactionRepository warehouseTransactionRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public WarehouseTransactionResponse create(WarehouseTransactionRequest request) {
        if (warehouseTransactionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Transaction code already exists: " + request.code());
        }
        WarehouseTransaction transaction = inventoryMapper.toEntity(request);
        return inventoryMapper.toResponse(warehouseTransactionRepository.save(transaction));
    }

    @Override
    public WarehouseTransactionResponse update(UUID id, WarehouseTransactionRequest request) {
        WarehouseTransaction transaction = find(id);
        if (!transaction.getCode().equals(request.code()) && warehouseTransactionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Transaction code already exists: " + request.code());
        }
        inventoryMapper.update(transaction, request);
        return inventoryMapper.toResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseTransactionResponse getById(UUID id) {
        return inventoryMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseTransactionResponse> findAll() {
        return warehouseTransactionRepository.findAllByOrderByTxnDateDesc().stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Override
    public WarehouseTransactionResponse approve(UUID id) {
        WarehouseTransaction transaction = find(id);
        transaction.setStatus(STATUS_APPROVED);
        return inventoryMapper.toResponse(transaction);
    }

    @Override
    public WarehouseTransactionResponse reject(UUID id) {
        WarehouseTransaction transaction = find(id);
        transaction.setStatus(STATUS_REJECTED);
        return inventoryMapper.toResponse(transaction);
    }

    @Override
    public void delete(UUID id) {
        warehouseTransactionRepository.delete(find(id));
    }

    private WarehouseTransaction find(UUID id) {
        return warehouseTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Warehouse transaction not found: " + id));
    }
}
