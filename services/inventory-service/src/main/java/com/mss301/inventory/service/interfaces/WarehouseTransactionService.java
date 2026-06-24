package com.mss301.inventory.service.interfaces;

import com.mss301.inventory.dto.request.WarehouseTransactionRequest;
import com.mss301.inventory.dto.response.WarehouseTransactionResponse;

import java.util.List;
import java.util.UUID;

public interface WarehouseTransactionService {

    WarehouseTransactionResponse create(WarehouseTransactionRequest request);

    WarehouseTransactionResponse update(UUID id, WarehouseTransactionRequest request);

    WarehouseTransactionResponse getById(UUID id);

    List<WarehouseTransactionResponse> findAll();

    WarehouseTransactionResponse approve(UUID id);

    WarehouseTransactionResponse reject(UUID id);

    void delete(UUID id);
}
