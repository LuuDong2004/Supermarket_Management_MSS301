package com.mss301.supplier.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.response.PurchaseOrderResponse;
import com.mss301.supplier.entity.PurchaseOrder;
import com.mss301.supplier.mapper.SupplierMapper;
import com.mss301.supplier.repository.PurchaseOrderRepository;
import com.mss301.supplier.service.interfaces.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        if (purchaseOrderRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Purchase order code already exists: " + request.code());
        }
        PurchaseOrder order = supplierMapper.toEntity(request);
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("Pending");
        }
        if (order.getApproval() == null || order.getApproval().isBlank()) {
            order.setApproval("Chờ duyệt");
        }
        if (order.getSupplierStatus() == null || order.getSupplierStatus().isBlank()) {
            order.setSupplierStatus("Chờ xác nhận");
        }
        return supplierMapper.toResponse(purchaseOrderRepository.save(order));
    }

    @Override
    public PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request) {
        PurchaseOrder order = find(id);
        if (!order.getCode().equals(request.code()) && purchaseOrderRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Purchase order code already exists: " + request.code());
        }
        supplierMapper.update(order, request);
        return supplierMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(UUID id) {
        return supplierMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> list() {
        return purchaseOrderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    @Override
    public PurchaseOrderResponse approve(UUID id) {
        PurchaseOrder order = find(id);
        order.setStatus("Approved");
        order.setApproval("Đã duyệt");
        return supplierMapper.toResponse(order);
    }

    @Override
    public PurchaseOrderResponse reject(UUID id) {
        PurchaseOrder order = find(id);
        order.setStatus("Rejected");
        order.setApproval("Từ chối");
        return supplierMapper.toResponse(order);
    }

    @Override
    public PurchaseOrderResponse receive(UUID id) {
        PurchaseOrder order = find(id);
        order.setStatus("Received");
        return supplierMapper.toResponse(order);
    }

    @Override
    public void delete(UUID id) {
        purchaseOrderRepository.delete(find(id));
    }

    private PurchaseOrder find(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Purchase order not found: " + id));
    }
}
