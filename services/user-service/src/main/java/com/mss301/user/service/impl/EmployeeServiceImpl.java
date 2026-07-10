package com.mss301.user.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.response.PageResponse;
import com.mss301.storage.StorageService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final StorageService storageService;

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
        Employee employee = employeeMapper.toEntity(request);
        // BR-03: Employee ID auto-generated when not supplied.
        if (employee.getCode() == null || employee.getCode().isBlank()) {
            employee.setCode(generateCode());
        } else if (employeeRepository.existsByCode(employee.getCode())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Employee code already exists");
        }
        if (employee.getStatus() == null || employee.getStatus().isBlank()) {
            employee.setStatus("Đang làm");
        }
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee employee = findActive(id);
        employeeMapper.update(employee, request);
        return employeeMapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse uploadImage(UUID id, MultipartFile file) {
        Employee employee = findActive(id);
        String url = storageService.upload(file, "employees");
        employee.setImageUrl(url);
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse deactivate(UUID id) {
        Employee employee = findActive(id);
        employee.setStatus("Nghỉ việc");
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse activate(UUID id) {
        Employee employee = findActive(id);
        employee.setStatus("Đang làm");
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public void softDelete(UUID id) {
        Employee employee = findActive(id);
        employeeRepository.delete(employee); // @SQLDelete flips the deleted flag
    }

    /** Generate the next unique EMP-#### code. */
    private String generateCode() {
        long n = employeeRepository.count() + 1;
        String code;
        do {
            code = String.format("EMP-%04d", n);
            n++;
        } while (employeeRepository.existsByCode(code));
        return code;
    }

    private Employee findActive(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Employee not found"));
    }
}
