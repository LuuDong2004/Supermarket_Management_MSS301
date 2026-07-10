package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.SupplierPriceItemRequest;
import com.mss301.supplier.dto.response.SupplierPriceItemResponse;

import java.util.List;
import java.util.UUID;

public interface PriceListService {

    List<SupplierPriceItemResponse> listMine();

    SupplierPriceItemResponse create(SupplierPriceItemRequest request);

    SupplierPriceItemResponse update(UUID id, SupplierPriceItemRequest request);

    void delete(UUID id);
}
