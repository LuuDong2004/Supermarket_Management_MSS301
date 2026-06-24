package com.mss301.sales.service.interfaces;

import com.mss301.sales.dto.request.CustomerRequest;
import com.mss301.sales.dto.request.PointsRequest;
import com.mss301.sales.dto.response.CustomerResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CustomerService {

    CustomerResponse create(CustomerRequest request);

    CustomerResponse update(UUID id, CustomerRequest request);

    CustomerResponse getById(UUID id);

    CustomerResponse getByPhone(String phone);

    PageResponse<CustomerResponse> search(String query, Pageable pageable);

    CustomerResponse adjustPoints(UUID id, PointsRequest request);

    void delete(UUID id);
}
