package com.mss301.product.service.interfaces;

import com.mss301.product.dto.request.CategoryRequest;
import com.mss301.product.dto.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    List<CategoryResponse> list();

    CategoryResponse create(CategoryRequest request);

    CategoryResponse update(UUID id, CategoryRequest request);

    void delete(UUID id);
}
