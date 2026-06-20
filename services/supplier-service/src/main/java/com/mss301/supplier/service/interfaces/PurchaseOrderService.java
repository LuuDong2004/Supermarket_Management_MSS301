package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.response.PurchaseOrderResponse;

import java.util.List;
import java.util.UUID;

public interface PurchaseOrderService {

    PurchaseOrderResponse create(PurchaseOrderRequest request);

    PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request);

    PurchaseOrderResponse getById(UUID id);

    List<PurchaseOrderResponse> list();

    PurchaseOrderResponse approve(UUID id);

    PurchaseOrderResponse reject(UUID id);

    PurchaseOrderResponse receive(UUID id);

    void delete(UUID id);
}
