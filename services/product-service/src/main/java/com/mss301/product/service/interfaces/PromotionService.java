package com.mss301.product.service.interfaces;

import com.mss301.product.dto.request.PromotionRequest;
import com.mss301.product.dto.response.PromotionResponse;

import java.util.List;
import java.util.UUID;

public interface PromotionService {

    PromotionResponse create(PromotionRequest request);

    PromotionResponse update(UUID id, PromotionRequest request);

    PromotionResponse getById(UUID id);

    List<PromotionResponse> getAll();

    void delete(UUID id);
}
