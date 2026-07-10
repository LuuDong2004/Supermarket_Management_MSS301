package com.mss301.supplier.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.common.exception.UnauthorizedException;
import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.request.ShipRequest;
import com.mss301.supplier.dto.response.PurchaseOrderResponse;
import com.mss301.supplier.entity.PurchaseOrder;
import com.mss301.supplier.mapper.SupplierMapper;
import com.mss301.supplier.repository.PurchaseOrderRepository;
import com.mss301.supplier.service.SupplierContext;
import com.mss301.supplier.service.interfaces.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierMapper supplierMapper;
    private final SupplierContext supplierContext;

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

    // ----- Supplier portal -----

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> listMine() {
        String supplierName = supplierContext.current().getName();
        return purchaseOrderRepository.findBySupplierIgnoreCaseOrderByOrderDateDesc(supplierName).stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    @Override
    public PurchaseOrderResponse confirmBySupplier(UUID id) {
        PurchaseOrder order = findOwned(id);
        order.setSupplierStatus("Đã xác nhận");
        return supplierMapper.toResponse(order);
    }

    @Override
    public PurchaseOrderResponse rejectBySupplier(UUID id) {
        PurchaseOrder order = findOwned(id);
        order.setSupplierStatus("NCC từ chối");
        return supplierMapper.toResponse(order);
    }

    @Override
    public PurchaseOrderResponse ship(UUID id, ShipRequest request) {
        PurchaseOrder order = findOwned(id);
        order.setSupplierStatus("Đang giao");
        if (request != null) {
            if (request.expectedDelivery() != null) {
                order.setExpectedDelivery(request.expectedDelivery());
            }
            if (request.note() != null) {
                order.setSupplierNote(request.note());
            }
        }
        return supplierMapper.toResponse(order);
    }

    @Override
    public PurchaseOrderResponse deliver(UUID id) {
        PurchaseOrder order = findOwned(id);
        order.setSupplierStatus("Đã giao");
        order.setDeliveredDate(LocalDate.now());
        return supplierMapper.toResponse(order);
    }

    private PurchaseOrder find(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Purchase order not found: " + id));
    }

    /** Load a PO and verify it belongs to the current supplier. */
    private PurchaseOrder findOwned(UUID id) {
        PurchaseOrder order = find(id);
        String supplierName = supplierContext.current().getName();
        if (!supplierName.equalsIgnoreCase(order.getSupplier())) {
            throw new UnauthorizedException(ErrorCode.UNAUTHORIZED, "Đơn mua không thuộc nhà cung cấp của bạn.");
        }
        return order;
    }
}
