package com.mss301.product.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.product.dto.internal.StockChangeRequest;
import com.mss301.product.dto.request.ProductRequest;
import com.mss301.product.dto.response.ProductResponse;
import com.mss301.product.entity.Product;
import com.mss301.product.mapper.ProductMapper;
import com.mss301.product.repository.ProductRepository;
import com.mss301.product.service.interfaces.ProductService;
import com.mss301.response.PageResponse;
import com.mss301.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final StorageService storageService;

    @Override
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Product code already exists: " + request.code());
        }
        Product product = productMapper.toEntity(request);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = find(id);
        if (!product.getCode().equals(request.code()) && productRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Product code already exists: " + request.code());
        }
        productMapper.update(product, request);
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse uploadImage(UUID id, MultipartFile file) {
        Product product = find(id);
        String url = storageService.upload(file, "products");
        product.setImageUrl(url);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(UUID id) {
        return productMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(String query, String category, Pageable pageable) {
        Page<Product> page;
        if (StringUtils.hasText(query)) {
            page = productRepository.findByNameContainingIgnoreCaseOrBarcodeContainingIgnoreCase(query, query, pageable);
        } else if (StringUtils.hasText(category)) {
            page = productRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            page = productRepository.findAll(pageable);
        }
        Page<ProductResponse> mapped = page.map(productMapper::toResponse);
        return PageResponse.of(mapped.getContent(), mapped.getNumber(), mapped.getSize(),
                mapped.getTotalElements(), mapped.getTotalPages(), mapped.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> lowStock(int threshold) {
        return productRepository.findByStockLessThanEqual(threshold).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> categories() {
        return productRepository.findDistinctCategories();
    }

    @Override
    public void decrementStock(StockChangeRequest request) {
        if (request == null || request.lines() == null) {
            return;
        }
        for (StockChangeRequest.StockLine line : request.lines()) {
            if (line == null || line.code() == null || line.quantity() <= 0) {
                continue;
            }
            Product product = productRepository.findByCode(line.code())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            ErrorCode.RESOURCE_NOT_FOUND, "Product not found: " + line.code()));
            int remaining = product.getStock() - line.quantity();
            if (remaining < 0) {
                throw new ConflictException(ErrorCode.CONFLICT,
                        product.getName() + " chỉ còn " + product.getStock() + " trong kho");
            }
            product.setStock(remaining);
        }
    }

    @Override
    public void incrementStock(StockChangeRequest request) {
        if (request == null || request.lines() == null) {
            return;
        }
        for (StockChangeRequest.StockLine line : request.lines()) {
            if (line == null || line.code() == null || line.quantity() <= 0) {
                continue;
            }
            productRepository.findByCode(line.code()).ifPresent(product ->
                    product.setStock(product.getStock() + line.quantity()));
        }
    }

    @Override
    public void delete(UUID id) {
        productRepository.delete(find(id));
    }

    private Product find(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Product not found: " + id));
    }
}
