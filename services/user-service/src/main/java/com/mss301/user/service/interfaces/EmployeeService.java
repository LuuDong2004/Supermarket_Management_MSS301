package com.mss301.user.service.interfaces;

import com.mss301.response.PageResponse;
import com.mss301.user.dto.request.EmployeeRequest;
import com.mss301.user.dto.response.EmployeeResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface EmployeeService {

    PageResponse<EmployeeResponse> getAll(String query, Pageable pageable);

    EmployeeResponse getById(UUID id);

    EmployeeResponse create(EmployeeRequest request);

    EmployeeResponse update(UUID id, EmployeeRequest request);

    EmployeeResponse uploadImage(UUID id, MultipartFile file);

    void softDelete(UUID id);
}
