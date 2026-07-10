package com.mss301.sales.client;

import com.mss301.sales.client.dto.StockChangeRequest;
import com.mss301.sales.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Calls the product-service internal API (load-balanced via Eureka) to adjust
 * stock when a sale completes (decrement) or a return is processed (increment).
 */
@FeignClient(name = "product-service", path = "/internal/products", configuration = FeignClientConfig.class)
public interface ProductClient {

    @PostMapping("/decrement-stock")
    void decrementStock(@RequestBody StockChangeRequest request);

    @PostMapping("/increment-stock")
    void incrementStock(@RequestBody StockChangeRequest request);
}
