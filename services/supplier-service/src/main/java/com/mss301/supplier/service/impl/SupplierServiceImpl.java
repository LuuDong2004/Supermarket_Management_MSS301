package com.mss301.supplier.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.supplier.dto.request.SupplierRequest;
import com.mss301.supplier.dto.request.SupplierSelfRequest;
import com.mss301.supplier.dto.response.SupplierResponse;
import com.mss301.supplier.entity.Supplier;
import com.mss301.supplier.mapper.SupplierMapper;
import com.mss301.supplier.repository.SupplierRepository;
import com.mss301.supplier.service.SupplierContext;
import com.mss301.supplier.service.interfaces.SupplierService;
import com.mss301.response.PageResponse;
import com.mss301.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;
    private final StorageService storageService;
    private final SupplierContext supplierContext;

    @Override
    public SupplierResponse create(SupplierRequest request) {
        if (supplierRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Supplier code already exists: " + request.code());
        }
        Supplier supplier = supplierMapper.toEntity(request);
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    public SupplierResponse update(UUID id, SupplierRequest request) {
        Supplier supplier = find(id);
        if (!supplier.getCode().equals(request.code()) && supplierRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Supplier code already exists: " + request.code());
        }
        supplierMapper.update(supplier, request);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    public SupplierResponse uploadImage(UUID id, MultipartFile file) {
        Supplier supplier = find(id);
        String url = storageService.upload(file, "suppliers");
        supplier.setImageUrl(url);
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getById(UUID id) {
        return supplierMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SupplierResponse> search(String query, Pageable pageable) {
        Page<Supplier> page;
        if (StringUtils.hasText(query)) {
            page = supplierRepository.findByNameContainingIgnoreCaseOrContactContainingIgnoreCase(query, query, pageable);
        } else {
            page = supplierRepository.findAll(pageable);
        }
        Page<SupplierResponse> mapped = page.map(supplierMapper::toResponse);
        return PageResponse.of(mapped.getContent(), mapped.getNumber(), mapped.getSize(),
                mapped.getTotalElements(), mapped.getTotalPages(), mapped.isLast());
    }

    @Override
    public void delete(UUID id) {
        supplierRepository.delete(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getMine() {
        return supplierMapper.toResponse(supplierContext.current());
    }

    @Override
    public SupplierResponse updateMine(SupplierSelfRequest request) {
        Supplier supplier = supplierContext.current();
        if (request.contact() != null) supplier.setContact(request.contact());
        if (request.phone() != null) supplier.setPhone(request.phone());
        if (request.email() != null) supplier.setEmail(request.email());
        if (request.address() != null) supplier.setAddress(request.address());
        if (request.terms() != null) supplier.setTerms(request.terms());
        return supplierMapper.toResponse(supplier);
    }

    private Supplier find(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Supplier not found: " + id));
    }
}
