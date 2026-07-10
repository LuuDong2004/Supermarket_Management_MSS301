package com.mss301.product.dto.internal;

import java.util.List;

/**
 * Service-to-service payload used by sales-service to reduce (checkout) or
 * restore (return/refund) product stock in bulk.
 */
public record StockChangeRequest(List<StockLine> lines) {

    public record StockLine(String code, int quantity) {
    }
}
