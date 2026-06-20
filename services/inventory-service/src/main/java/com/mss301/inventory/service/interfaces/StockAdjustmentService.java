package com.mss301.inventory.service.interfaces;

import com.mss301.inventory.dto.request.StockAdjustmentRequest;
import com.mss301.inventory.dto.response.StockAdjustmentResponse;

import java.util.List;
import java.util.UUID;

public interface StockAdjustmentService {

    StockAdjustmentResponse create(StockAdjustmentRequest request);

    StockAdjustmentResponse update(UUID id, StockAdjustmentRequest request);

    StockAdjustmentResponse getById(UUID id);

    List<StockAdjustmentResponse> findAll();

    StockAdjustmentResponse approve(UUID id);

    StockAdjustmentResponse reject(UUID id);

    void delete(UUID id);
}
