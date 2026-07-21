package com.mss301.product.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.product.dto.request.CategoryRequest;
import com.mss301.product.dto.response.CategoryResponse;
import com.mss301.product.entity.Category;
import com.mss301.product.repository.CategoryRepository;
import com.mss301.product.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findAllByOrderBySeqAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Category already exists: " + request.name());
        }
        int nextSeq = categoryRepository.findAllByOrderBySeqAsc().size() + 1;
        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .active(request.active())
                .requiresExpiry(request.requiresExpiry())
                .taxGroup(request.taxGroup())
                .seq(nextSeq)
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = find(id);
        if (!category.getName().equals(request.name()) && categoryRepository.existsByName(request.name())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Category already exists: " + request.name());
        }
        category.setName(request.name());
        category.setDescription(request.description());
        category.setActive(request.active());
        category.setRequiresExpiry(request.requiresExpiry());
        category.setTaxGroup(request.taxGroup());
        return toResponse(category);
    }

    @Override
    public void delete(UUID id) {
        categoryRepository.delete(find(id));
    }

    private Category find(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Category not found: " + id));
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription(), c.isActive(), c.isRequiresExpiry(), c.getTaxGroup());
    }
}
