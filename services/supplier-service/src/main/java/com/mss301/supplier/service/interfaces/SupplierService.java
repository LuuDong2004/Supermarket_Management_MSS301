package com.mss301.supplier.service.interfaces;

import com.mss301.supplier.dto.request.SupplierRequest;
import com.mss301.supplier.dto.request.SupplierSelfRequest;
import com.mss301.supplier.dto.response.SupplierResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface SupplierService {

    SupplierResponse create(SupplierRequest request);

    SupplierResponse update(UUID id, SupplierRequest request);

    SupplierResponse uploadImage(UUID id, MultipartFile file);

    SupplierResponse getById(UUID id);

    PageResponse<SupplierResponse> search(String query, Pageable pageable);

    void delete(UUID id);

    // ----- Supplier self-service (logged-in supplier's own profile) -----
    SupplierResponse getMine();

    SupplierResponse updateMine(SupplierSelfRequest request);
}
