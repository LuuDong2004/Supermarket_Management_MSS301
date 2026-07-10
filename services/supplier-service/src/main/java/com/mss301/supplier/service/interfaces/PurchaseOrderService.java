package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.request.ShipRequest;
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

    // ----- Supplier portal (scoped to the logged-in supplier) -----
    List<PurchaseOrderResponse> listMine();

    PurchaseOrderResponse confirmBySupplier(UUID id);

    PurchaseOrderResponse rejectBySupplier(UUID id);

    PurchaseOrderResponse ship(UUID id, ShipRequest request);

    PurchaseOrderResponse deliver(UUID id);
}
