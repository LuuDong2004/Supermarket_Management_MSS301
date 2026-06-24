package com.mss301.product.service.interfaces;

import com.mss301.product.dto.request.ProductRequest;
import com.mss301.product.dto.response.ProductResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse update(UUID id, ProductRequest request);

    ProductResponse getById(UUID id);

    PageResponse<ProductResponse> search(String query, String category, Pageable pageable);

    List<ProductResponse> lowStock(int threshold);

    List<String> categories();

    void delete(UUID id);
}
