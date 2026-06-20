package com.mss301.inventory.service.interfaces;

import com.mss301.inventory.dto.request.StockCountRequest;
import com.mss301.inventory.dto.response.StockCountResponse;

import java.util.List;
import java.util.UUID;

public interface StockCountService {

    StockCountResponse create(StockCountRequest request);

    StockCountResponse update(UUID id, StockCountRequest request);

    StockCountResponse getById(UUID id);

    List<StockCountResponse> findAll();

    void delete(UUID id);
}
