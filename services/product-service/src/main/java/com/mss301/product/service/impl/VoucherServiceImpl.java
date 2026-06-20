package com.mss301.product.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.product.dto.request.VoucherRequest;
import com.mss301.product.dto.response.VoucherResponse;
import com.mss301.product.mapper.ProductMapper;
import com.mss301.product.repository.VoucherRepository;
import com.mss301.product.service.interfaces.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final ProductMapper productMapper;

    @Override
    public VoucherResponse create(VoucherRequest request) {
        if (voucherRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Voucher code already exists: " + request.code());
        }
        return productMapper.toResponse(voucherRepository.save(productMapper.toEntity(request)));
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherResponse getByCode(String code) {
        return voucherRepository.findByCode(code)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Voucher not found: " + code));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getAll() {
        return voucherRepository.findAll().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        voucherRepository.delete(voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Voucher not found: " + id)));
    }
}
