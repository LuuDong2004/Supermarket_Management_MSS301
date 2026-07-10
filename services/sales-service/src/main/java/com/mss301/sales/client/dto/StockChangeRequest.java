package com.mss301.sales.client.dto;

import java.util.List;

/**
 * Mirrors product-service's internal stock payload: {@code {lines:[{code,quantity}]}}.
 */
public record StockChangeRequest(List<StockLine> lines) {

    public record StockLine(String code, int quantity) {
    }
}
