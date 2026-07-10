package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.GoodsReceiptRequest;
import com.mss301.supplier.dto.response.GoodsReceiptResponse;

import java.util.List;
import java.util.UUID;

public interface GoodsReceiptService {

    List<GoodsReceiptResponse> list();

    GoodsReceiptResponse getById(UUID id);

    GoodsReceiptResponse create(GoodsReceiptRequest request);

    GoodsReceiptResponse update(UUID id, GoodsReceiptRequest request);

    GoodsReceiptResponse approve(UUID id);

    GoodsReceiptResponse reject(UUID id);

    void delete(UUID id);
}
