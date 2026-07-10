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
        BigDecimal computed = BigDecimal.ZERO;
        for (ReturnItemRequest line : request.lineItems()) {
            if (line == null) {
                continue;
            }
            BigDecimal unit = line.unitPrice() == null ? BigDecimal.ZERO : line.unitPrice();
            int qty = line.quantity() == null ? 0 : line.quantity();
            BigDecimal lineTotal = line.lineTotal() != null
                    ? line.lineTotal()
                    : unit.multiply(BigDecimal.valueOf(qty));
            computed = computed.add(lineTotal);
            items.add(SaleReturnItem.builder()
                    .productCode(line.productCode())
                    .productName(line.productName())
                    .unitPrice(unit)
                    .quantity(qty)
                    .lineTotal(lineTotal)
                    .build());
        }

        BigDecimal refund = request.refundAmount() != null ? request.refundAmount() : computed;

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
            if (item.getProductCode() != null && item.getQuantity() != null && item.getQuantity() > 0) {
                restock.add(new StockChangeRequest.StockLine(item.getProductCode(), item.getQuantity()));
            }
        }
        if (!restock.isEmpty()) {
            productClient.incrementStock(new StockChangeRequest(restock));
        }

        return salesMapper.toResponse(returnRepository.save(saleReturn));
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
