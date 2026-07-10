package com.mss301.sales.service.interfaces;

import com.mss301.sales.dto.request.ReturnRequest;
import com.mss301.sales.dto.response.ReturnResponse;
import com.mss301.sales.dto.response.SaleResponse;

import java.util.List;
import java.util.UUID;

public interface ReturnService {

    ReturnResponse create(ReturnRequest request);

    List<ReturnResponse> list();

    ReturnResponse getById(UUID id);

    /** Look up the original sale (with line items) to base a return on. */
    SaleResponse lookupSale(String saleCode);
}
