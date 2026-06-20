package com.mss301.sales.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.SaleRepository;
import com.mss301.sales.service.interfaces.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SalesMapper salesMapper;

    @Override
    public SaleResponse create(SaleRequest request) {
        if (saleRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Sale code already exists: " + request.code());
        }
        Sale sale = salesMapper.toEntity(request);
        return salesMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getById(UUID id) {
        return salesMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> list() {
        return saleRepository.findAllByOrderByCodeDesc().stream()
                .map(salesMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        saleRepository.delete(find(id));
    }

    private Sale find(UUID id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Sale not found: " + id));
    }
}
