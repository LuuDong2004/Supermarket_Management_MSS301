package com.mss301.product.controller;

import com.mss301.product.dto.internal.StockChangeRequest;
import com.mss301.product.service.interfaces.ProductService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Service-to-service stock endpoints. NOT routed by the gateway and protected by
 * the internal API key — used by sales-service on checkout (decrement) and on
 * return/refund (increment).
 */
@Hidden
@RestController
@RequestMapping("/internal/products")
@RequiredArgsConstructor
public class InternalProductController {

    private final ProductService productService;

    @PostMapping("/decrement-stock")
    public ResponseEntity<Void> decrement(@RequestBody StockChangeRequest request) {
        productService.decrementStock(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/increment-stock")
    public ResponseEntity<Void> increment(@RequestBody StockChangeRequest request) {
        productService.incrementStock(request);
        return ResponseEntity.ok().build();
    }
}
