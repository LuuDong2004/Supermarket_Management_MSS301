package com.mss301.product.service.interfaces;

import com.mss301.product.dto.request.VoucherRequest;
import com.mss301.product.dto.response.VoucherResponse;

import java.util.List;
import java.util.UUID;

public interface VoucherService {

    VoucherResponse create(VoucherRequest request);

    VoucherResponse getByCode(String code);

    List<VoucherResponse> getAll();

    void delete(UUID id);
}
