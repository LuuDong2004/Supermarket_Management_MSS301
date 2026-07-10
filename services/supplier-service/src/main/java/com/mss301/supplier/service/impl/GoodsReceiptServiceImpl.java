package com.mss301.supplier.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.supplier.dto.request.GoodsReceiptRequest;
import com.mss301.supplier.dto.response.GoodsReceiptResponse;
import com.mss301.supplier.entity.GoodsReceipt;
import com.mss301.supplier.repository.GoodsReceiptRepository;
import com.mss301.supplier.service.interfaces.GoodsReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private static final String STATUS_PENDING = "Chờ duyệt";
    private static final String STATUS_APPROVED = "Đã duyệt";
    private static final String STATUS_REJECTED = "Từ chối";

    private final GoodsReceiptRepository goodsReceiptRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceiptResponse> list() {
        return goodsReceiptRepository.findAllByOrderByReceiveDateDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponse getById(UUID id) {
        return toResponse(find(id));
    }

    @Override
    public GoodsReceiptResponse create(GoodsReceiptRequest request) {
        if (goodsReceiptRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Goods receipt code already exists: " + request.code());
        }
        GoodsReceipt receipt = GoodsReceipt.builder()
                .code(request.code())
                .poCode(request.poCode())
                .supplier(request.supplier())
                .receiveDate(request.receiveDate())
                .receivedBy(request.receivedBy())
                .items(request.items())
                .total(request.total())
                .note(request.note())
                .status(STATUS_PENDING)
                .build();
        return toResponse(goodsReceiptRepository.save(receipt));
    }

    @Override
    public GoodsReceiptResponse update(UUID id, GoodsReceiptRequest request) {
        GoodsReceipt receipt = find(id);
        if (!receipt.getCode().equals(request.code()) && goodsReceiptRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Goods receipt code already exists: " + request.code());
        }
        receipt.setPoCode(request.poCode());
        receipt.setSupplier(request.supplier());
        receipt.setReceiveDate(request.receiveDate());
        receipt.setReceivedBy(request.receivedBy());
        receipt.setItems(request.items());
        receipt.setTotal(request.total());
        receipt.setNote(request.note());
        return toResponse(receipt);
    }

    @Override
    public GoodsReceiptResponse approve(UUID id) {
        GoodsReceipt receipt = find(id);
        receipt.setStatus(STATUS_APPROVED);
        return toResponse(receipt);
    }

    @Override
    public GoodsReceiptResponse reject(UUID id) {
        GoodsReceipt receipt = find(id);
        receipt.setStatus(STATUS_REJECTED);
        return toResponse(receipt);
    }

    @Override
    public void delete(UUID id) {
        goodsReceiptRepository.delete(find(id));
    }

    private GoodsReceipt find(UUID id) {
        return goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Goods receipt not found: " + id));
    }

    private GoodsReceiptResponse toResponse(GoodsReceipt r) {
        return new GoodsReceiptResponse(
                r.getId(), r.getCode(), r.getPoCode(), r.getSupplier(), r.getReceiveDate(),
                r.getReceivedBy(), r.getItems(), r.getTotal(), r.getStatus(), r.getNote());
    }
}
