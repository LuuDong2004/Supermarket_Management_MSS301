package com.mss301.supplier.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.common.exception.UnauthorizedException;
import com.mss301.supplier.dto.request.SupplierPriceItemRequest;
import com.mss301.supplier.dto.response.SupplierPriceItemResponse;
import com.mss301.supplier.entity.SupplierPriceItem;
import com.mss301.supplier.mapper.SupplierMapper;
import com.mss301.supplier.repository.SupplierPriceItemRepository;
import com.mss301.supplier.service.SupplierContext;
import com.mss301.supplier.service.interfaces.PriceListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PriceListServiceImpl implements PriceListService {

    private final SupplierPriceItemRepository priceItemRepository;
    private final SupplierMapper supplierMapper;
    private final SupplierContext supplierContext;

    @Override
    @Transactional(readOnly = true)
    public List<SupplierPriceItemResponse> listMine() {
        String supplierName = supplierContext.current().getName();
        return priceItemRepository.findBySupplierIgnoreCaseOrderByProductNameAsc(supplierName).stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    @Override
    public SupplierPriceItemResponse create(SupplierPriceItemRequest request) {
        String supplierName = supplierContext.current().getName();
        SupplierPriceItem item = supplierMapper.toEntity(request);
        item.setSupplier(supplierName);
        assignCode(item, request);
        if (item.getStatus() == null || item.getStatus().isBlank()) {
            item.setStatus("Đang bán");
        }
        return supplierMapper.toResponse(priceItemRepository.save(item));
    }

    @Override
    public SupplierPriceItemResponse update(UUID id, SupplierPriceItemRequest request) {
        SupplierPriceItem item = findOwned(id);
        supplierMapper.update(item, request);
        return supplierMapper.toResponse(item);
    }

    @Override
    public void delete(UUID id) {
        priceItemRepository.delete(findOwned(id));
    }

    private void assignCode(SupplierPriceItem item, SupplierPriceItemRequest request) {
        String code = request.code();
        if (code == null || code.isBlank()) {
            code = "PL-" + System.currentTimeMillis();
        }
        if (priceItemRepository.existsByCode(code)) {
            throw new ConflictException(ErrorCode.CONFLICT, "Mã báo giá đã tồn tại: " + code);
        }
        item.setCode(code);
    }

    private SupplierPriceItem findOwned(UUID id) {
        SupplierPriceItem item = priceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Price item not found: " + id));
        String supplierName = supplierContext.current().getName();
        if (!supplierName.equalsIgnoreCase(item.getSupplier())) {
            throw new UnauthorizedException(ErrorCode.UNAUTHORIZED, "Mục báo giá không thuộc nhà cung cấp của bạn.");
        }
        return item;
    }
}
