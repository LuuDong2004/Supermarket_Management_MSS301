package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.SupplierRequest;
import com.mss301.supplier.dto.response.SupplierResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface SupplierService {

    SupplierResponse create(SupplierRequest request);

    SupplierResponse update(UUID id, SupplierRequest request);

    SupplierResponse getById(UUID id);

    PageResponse<SupplierResponse> search(String query, Pageable pageable);

    void delete(UUID id);
}
