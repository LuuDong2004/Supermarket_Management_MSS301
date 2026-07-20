package com.mss301.sales.service.impl;

import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.client.ProductClient;
import com.mss301.sales.client.dto.StockChangeRequest;
import com.mss301.sales.dto.request.ReturnItemRequest;
import com.mss301.sales.dto.request.ReturnRequest;
import com.mss301.sales.dto.response.ReturnResponse;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.entity.SaleItem;
import com.mss301.sales.entity.SaleReturn;
import com.mss301.sales.entity.SaleReturnItem;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.SaleRepository;
import com.mss301.sales.repository.SaleReturnRepository;
import com.mss301.sales.service.interfaces.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReturnServiceImpl implements ReturnService {

    /** Return policy: items may be returned within 7 days of purchase (BR-04). */
    private static final long RETURN_WINDOW_DAYS = 7;

    private final SaleReturnRepository returnRepository;
    private final SaleRepository saleRepository;
    private final SalesMapper salesMapper;
    private final ProductClient productClient;
    private final com.mss301.sales.repository.CustomerRepository customerRepository;

    @Override
    public ReturnResponse create(ReturnRequest request) {
        Sale sale = saleRepository.findByCode(request.saleCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy hóa đơn: " + request.saleCode()));

        // Only a completed (paid) sale can be returned/refunded.
        if (!"COMPLETED".equalsIgnoreCase(sale.getStatus())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST,
                    "Chỉ có thể trả hàng cho hóa đơn đã hoàn tất thanh toán.");
        }

        // 7-day return policy, based on when the sale was recorded.
        if (sale.getCreatedAt() != null) {
            long days = Duration.between(sale.getCreatedAt(), Instant.now()).toDays();
            if (days > RETURN_WINDOW_DAYS) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST,
                        "Hóa đơn đã quá hạn trả hàng (" + RETURN_WINDOW_DAYS + " ngày).");
            }
        }

        String code = (request.code() == null || request.code().isBlank())
                ? "RT-" + System.currentTimeMillis()
                : request.code();
        if (returnRepository.existsByCode(code)) {
            throw new ConflictException(ErrorCode.CONFLICT, "Mã phiếu trả đã tồn tại: " + code);
        }

        List<SaleReturnItem> items = new ArrayList<>();
        List<SaleReturn> previousReturns = returnRepository.findBySaleCode(sale.getCode());
        java.util.Map<String, Integer> alreadyReturned = new java.util.HashMap<>();
        previousReturns.stream().flatMap(r -> r.getLineItems().stream()).forEach(item ->
                alreadyReturned.merge(item.getProductCode(), item.getQuantity(), Integer::sum));
        java.util.Map<String, SaleItem> originalItems = new java.util.HashMap<>();
        sale.getLineItems().forEach(item -> originalItems.put(item.getProductCode(), item));
        BigDecimal computed = BigDecimal.ZERO;
        for (ReturnItemRequest line : request.lineItems()) {
            if (line == null) {
                continue;
            }
            int qty = line.quantity() == null ? 0 : line.quantity();
            SaleItem original = originalItems.get(line.productCode());
            if (original == null) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST, "Product is not part of the original sale: " + line.productCode());
            }
            int remaining = original.getQuantity() - alreadyReturned.getOrDefault(line.productCode(), 0);
            if (qty > remaining) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST, "Return quantity exceeds the remaining refundable quantity.");
            }
            BigDecimal unit = original.getUnitPrice() == null ? BigDecimal.ZERO : original.getUnitPrice();
            BigDecimal lineTotal = unit.multiply(BigDecimal.valueOf(qty));
            if (line.lineTotal() != null && line.lineTotal().compareTo(lineTotal) != 0) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST, "Return line total does not match the original sale price.");
            }
            computed = computed.add(lineTotal);
            items.add(SaleReturnItem.builder()
                    .productCode(line.productCode())
                    .productName(line.productName())
                    .unitPrice(unit)
                    .quantity(qty)
                    .lineTotal(lineTotal)
                    .restockable(line.restockable() == null || line.restockable())
                    .build());
        }

        BigDecimal refund = request.refundAmount() != null ? request.refundAmount() : computed;
        if (refund.compareTo(computed) != 0) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Refund amount must match the selected return items.");
        }
        if (refund.compareTo(BigDecimal.ZERO) <= 0 || refund.compareTo(sale.getTotal()) > 0) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Refund amount is outside the refundable range.");
        }

        SaleReturn saleReturn = SaleReturn.builder()
                .code(code)
                .saleCode(request.saleCode())
                .cashier(request.cashier())
                .customerCode(request.customerCode() != null ? request.customerCode() : sale.getCustomerCode())
                .returnDate(request.returnDate())
                .reason(request.reason())
                .refundAmount(refund)
                .note(request.note())
                .status("Đã hoàn")
                .lineItems(items)
                .build();

        // Restore stock for the returned quantities.
        List<StockChangeRequest.StockLine> restock = new ArrayList<>();
        for (SaleReturnItem item : items) {
            if (item.isRestockable() && item.getProductCode() != null && item.getQuantity() != null && item.getQuantity() > 0) {
                restock.add(new StockChangeRequest.StockLine(item.getProductCode(), item.getQuantity()));
            }
        }
        if (!restock.isEmpty()) {
            productClient.incrementStock(new StockChangeRequest(restock));
        }

        reverseLoyalty(sale, refund);

        return salesMapper.toResponse(returnRepository.save(saleReturn));
    }

    private void reverseLoyalty(Sale sale, BigDecimal refund) {
        if (sale.getCustomerCode() == null || sale.getCustomerCode().isBlank() || sale.getTotal() == null
                || sale.getTotal().compareTo(BigDecimal.ZERO) <= 0) return;
        customerRepository.findByCode(sale.getCustomerCode()).ifPresent(customer -> {
            BigDecimal ratio = refund.divide(sale.getTotal(), 8, RoundingMode.DOWN);
            int earnedReverse = BigDecimal.valueOf(sale.getPointsEarned() == null ? 0 : sale.getPointsEarned())
                    .multiply(ratio).setScale(0, RoundingMode.DOWN).intValue();
            int redeemedRestore = BigDecimal.valueOf(sale.getPointsRedeemed() == null ? 0 : sale.getPointsRedeemed())
                    .multiply(ratio).setScale(0, RoundingMode.DOWN).intValue();
            int current = customer.getPoints() == null ? 0 : customer.getPoints();
            customer.setPoints(Math.max(0, current - earnedReverse + redeemedRestore));
            BigDecimal spent = customer.getSpent() == null ? BigDecimal.ZERO : customer.getSpent();
            customer.setSpent(spent.subtract(refund).max(BigDecimal.ZERO));
            customerRepository.save(customer);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnResponse> list() {
        return returnRepository.findAllByOrderByCodeDesc().stream()
                .map(salesMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnResponse getById(UUID id) {
        return salesMapper.toResponse(returnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND, "Return not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse lookupSale(String saleCode) {
        return salesMapper.toResponse(saleRepository.findByCode(saleCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy hóa đơn: " + saleCode)));
    }
}
