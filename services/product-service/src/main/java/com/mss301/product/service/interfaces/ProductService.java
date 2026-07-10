package com.mss301.product.service.interfaces;

import com.mss301.product.dto.internal.StockChangeRequest;
import com.mss301.product.dto.request.ProductRequest;
import com.mss301.product.dto.response.ProductResponse;
import com.mss301.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse update(UUID id, ProductRequest request);

    ProductResponse uploadImage(UUID id, MultipartFile file);

    ProductResponse getById(UUID id);

    PageResponse<ProductResponse> search(String query, String category, Pageable pageable);

    List<ProductResponse> lowStock(int threshold);

    List<String> categories();

    /** Reduce stock for each line (POS checkout). Fails if any line lacks stock. */
    void decrementStock(StockChangeRequest request);

    /** Restore stock for each line (return / refund). */
    void incrementStock(StockChangeRequest request);

    void delete(UUID id);
}
