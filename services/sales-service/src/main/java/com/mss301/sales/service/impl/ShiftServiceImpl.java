package com.mss301.sales.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.dto.request.ShiftRequest;
import com.mss301.sales.dto.response.ShiftResponse;
import com.mss301.sales.entity.Shift;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.ShiftRepository;
import com.mss301.sales.service.interfaces.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final SalesMapper salesMapper;

    @Override
    public ShiftResponse create(ShiftRequest request) {
        if (shiftRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Shift code already exists: " + request.code());
        }
        Shift shift = salesMapper.toEntity(request);
        return salesMapper.toResponse(shiftRepository.save(shift));
    }

    @Override
    public ShiftResponse update(UUID id, ShiftRequest request) {
        Shift shift = find(id);
        if (!shift.getCode().equals(request.code()) && shiftRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Shift code already exists: " + request.code());
        }
        salesMapper.update(shift, request);
        reconcile(shift);
        return salesMapper.toResponse(shift);
    }

    /**
     * When the cashier declares actual cash at close, compute the system-expected
     * cash (opening + sales) and the overage/shortage (BR-05).
     */
    private void reconcile(Shift shift) {
        if (shift.getClosingActual() == null) {
            return;
        }
        BigDecimal opening = shift.getOpening() == null ? BigDecimal.ZERO : shift.getOpening();
        BigDecimal sales = shift.getSales() == null ? BigDecimal.ZERO : shift.getSales();
        BigDecimal expected = opening.add(sales);
        shift.setClosingExpected(expected);
        shift.setVariance(shift.getClosingActual().subtract(expected));
    }

    @Override
    @Transactional(readOnly = true)
    public ShiftResponse getById(UUID id) {
        return salesMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShiftResponse> list() {
        return shiftRepository.findAllByOrderByCodeDesc().stream()
                .map(salesMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        shiftRepository.delete(find(id));
    }

    private Shift find(UUID id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Shift not found: " + id));
    }
}
