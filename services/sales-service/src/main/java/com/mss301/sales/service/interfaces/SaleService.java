package com.mss301.sales.service.interfaces;

import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.dto.response.SaleResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SaleService {

    SaleResponse create(SaleRequest request);

    SaleResponse getById(UUID id);

    List<SaleResponse> list();

    void delete(UUID id);

    void processSePayWebhook(SePayWebhookRequest webhookData);

    SaleResponse updateStatus(UUID id, String status);

    SaleResponse completeCashSale(UUID id);

    Map<String, String> getSePayConfig();
}
