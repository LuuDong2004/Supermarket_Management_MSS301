package com.mss301.sales.service.impl;

import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.dto.request.CustomerRequest;
import com.mss301.sales.dto.request.PointsRequest;
import com.mss301.sales.dto.response.CustomerResponse;
import com.mss301.sales.entity.Customer;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.CustomerRepository;
import com.mss301.sales.service.interfaces.CustomerService;
import com.mss301.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final SalesMapper salesMapper;

    @Override
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Customer code already exists: " + request.code());
        }
        Customer customer = salesMapper.toEntity(request);
        return salesMapper.toResponse(customerRepository.save(customer));
    }

    @Override
    public CustomerResponse update(UUID id, CustomerRequest request) {
        Customer customer = find(id);
        if (!customer.getCode().equals(request.code()) && customerRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Customer code already exists: " + request.code());
        }
        salesMapper.update(customer, request);
        return salesMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getById(UUID id) {
        return salesMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getByPhone(String phone) {
        Customer customer = customerRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Customer not found: " + phone));
        return salesMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> search(String query, Pageable pageable) {
        Page<Customer> page;
        if (StringUtils.hasText(query)) {
            page = customerRepository.findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(query, query, pageable);
        } else {
            page = customerRepository.findAll(pageable);
        }
        Page<CustomerResponse> mapped = page.map(salesMapper::toResponse);
        return PageResponse.of(mapped.getContent(), mapped.getNumber(), mapped.getSize(),
                mapped.getTotalElements(), mapped.getTotalPages(), mapped.isLast());
    }

    @Override
    public CustomerResponse adjustPoints(UUID id, PointsRequest request) {
        Customer customer = find(id);
        int current = customer.getPoints() == null ? 0 : customer.getPoints();
        int result = current + request.delta();
        if (result < 0) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Insufficient points: balance cannot go negative");
        }
        customer.setPoints(result);
        return salesMapper.toResponse(customer);
    }

    @Override
    public void delete(UUID id) {
        customerRepository.delete(find(id));
    }

    private Customer find(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Customer not found: " + id));
    }
}
