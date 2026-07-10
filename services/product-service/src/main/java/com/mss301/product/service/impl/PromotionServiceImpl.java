package com.mss301.product.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.product.dto.request.PromotionRequest;
import com.mss301.product.dto.response.PromotionResponse;
import com.mss301.product.entity.Promotion;
import com.mss301.product.mapper.ProductMapper;
import com.mss301.product.repository.PromotionRepository;
import com.mss301.product.service.interfaces.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductMapper productMapper;

    @Override
    public PromotionResponse create(PromotionRequest request) {
        if (promotionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Promotion code already exists: " + request.code());
        }
        return productMapper.toResponse(promotionRepository.save(productMapper.toEntity(request)));
    }

    @Override
    public PromotionResponse update(UUID id, PromotionRequest request) {
        Promotion promotion = find(id);
        if (!promotion.getCode().equals(request.code()) && promotionRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Promotion code already exists: " + request.code());
        }
        productMapper.update(promotion, request);
        return productMapper.toResponse(promotion);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponse getById(UUID id) {
        return productMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponse> getAll() {
        return promotionRepository.findAll(Sort.by(Sort.Direction.DESC, "fromDate")).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public PromotionResponse approve(UUID id) {
        Promotion promotion = find(id);
        promotion.setStatus("Đã duyệt");
        return productMapper.toResponse(promotion);
    }

    @Override
    public PromotionResponse reject(UUID id) {
        Promotion promotion = find(id);
        promotion.setStatus("Từ chối");
        return productMapper.toResponse(promotion);
    }

    @Override
    public void delete(UUID id) {
        promotionRepository.delete(find(id));
    }

    private Promotion find(UUID id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Promotion not found: " + id));
    }
}
