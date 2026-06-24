package com.mss301.user.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.response.PageResponse;
import com.mss301.user.dto.request.EmployeeRequest;
import com.mss301.user.dto.response.EmployeeResponse;
import com.mss301.user.entity.Employee;
import com.mss301.user.mapper.EmployeeMapper;
import com.mss301.user.repository.EmployeeRepository;
import com.mss301.user.service.interfaces.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> getAll(String query, Pageable pageable) {
        Page<Employee> source = (query == null || query.isBlank())
                ? employeeRepository.findAll(pageable)
                : employeeRepository.findByNameContainingIgnoreCase(query.trim(), pageable);
        Page<EmployeeResponse> page = source.map(employeeMapper::toResponse);
        return PageResponse.of(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getById(UUID id) {
        return employeeMapper.toResponse(findActive(id));
    }

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Employee code already exists");
        }
        Employee employee = employeeMapper.toEntity(request);
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee employee = findActive(id);
        employeeMapper.update(employee, request);
        return employeeMapper.toResponse(employee);
    }

    @Override
    public void softDelete(UUID id) {
        Employee employee = findActive(id);
        employeeRepository.delete(employee); // @SQLDelete flips the deleted flag
    }

    private Employee findActive(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Employee not found"));
    }
}
