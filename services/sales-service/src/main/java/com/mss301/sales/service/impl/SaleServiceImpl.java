package com.mss301.sales.service.impl;

import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.client.ProductClient;
import com.mss301.sales.client.dto.StockChangeRequest;
import com.mss301.sales.dto.request.SaleItemRequest;
import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.entity.Customer;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.entity.SaleItem;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.CustomerRepository;
import com.mss301.sales.repository.SaleRepository;
import com.mss301.sales.service.interfaces.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("\\bINV-?\\d+\\b", Pattern.CASE_INSENSITIVE);
    private static final String STATUS_COMPLETED = "COMPLETED";
    /** 1 loyalty point per 10,000 VND spent (BR-05). */
    private static final BigDecimal POINT_UNIT = new BigDecimal("10000");

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final SalesMapper salesMapper;
    private final ProductClient productClient;

    @Value("${sepay.bank-id:MB}")
    private String sepayBankId;

    @Value("${sepay.account-no:0000000000}")
    private String sepayAccountNo;

    @Value("${sepay.account-name:DEMO ACCOUNT}")
    private String sepayAccountName;

    @Override
    public SaleResponse create(SaleRequest request) {
        if (saleRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Sale code already exists: " + request.code());
        }
        Sale sale = salesMapper.toEntity(request);

        List<SaleItem> lineItems = buildLineItems(request.lineItems());
        sale.setLineItems(lineItems);
        if (!lineItems.isEmpty()) {
            sale.setItems(lineItems.size());
        }
        sale.setPointsRedeemed(request.pointsRedeemed() == null ? 0 : request.pointsRedeemed());
        applyCashChange(sale);

        if (sale.getStatus() == null || sale.getStatus().isBlank()) {
            if ("QR Code".equalsIgnoreCase(sale.getPayment()) || "SePay".equalsIgnoreCase(sale.getPayment())) {
                sale.setStatus("PENDING");
            } else {
                sale.setStatus(STATUS_COMPLETED);
            }
        }

        if (STATUS_COMPLETED.equals(sale.getStatus())) {
            applyCompletionEffects(sale);
        }
        return salesMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getById(UUID id) {
        return salesMapper.toResponse(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> list() {
        return saleRepository.findAllByOrderByCodeDesc().stream()
                .map(salesMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        saleRepository.delete(find(id));
    }

    @Override
    public void processSePayWebhook(SePayWebhookRequest webhookData) {
        if (webhookData == null || isOutgoingTransfer(webhookData)) {
            return;
        }

        BigDecimal paidAmount = webhookData.amountIn();
        if (paidAmount == null || paidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        String content = firstNonBlank(webhookData.transactionContent(), webhookData.body(), webhookData.code());
        if (content == null || content.isBlank()) {
            return;
        }

        Matcher matcher = ORDER_CODE_PATTERN.matcher(content);
        if (matcher.find()) {
            String rawOrderCode = matcher.group();
            String orderCode = normalizeOrderCode(rawOrderCode);
            Optional<Sale> saleOpt = saleRepository.findByCode(orderCode);
            if (saleOpt.isEmpty() && !orderCode.equals(rawOrderCode)) {
                saleOpt = saleRepository.findByCode(rawOrderCode);
            }
            if (saleOpt.isPresent()) {
                Sale sale = saleOpt.get();
                if ("PENDING".equals(sale.getStatus()) && paidAmount.compareTo(sale.getTotal()) >= 0) {
                    sale.setStatus(STATUS_COMPLETED);
                    applyCompletionEffects(sale);
                    saleRepository.save(sale);
                }
            }
        }
    }

    @Override
    public SaleResponse updateStatus(UUID id, String status) {
        if (status == null || status.isBlank()) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "status is required");
        }
        Sale sale = find(id);
        boolean completing = STATUS_COMPLETED.equalsIgnoreCase(status) && !STATUS_COMPLETED.equals(sale.getStatus());
        sale.setStatus(status);
        if (completing) {
            applyCompletionEffects(sale);
        }
        return salesMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    public SaleResponse completeCashSale(UUID id) {
        Sale sale = find(id);
        boolean completing = !STATUS_COMPLETED.equals(sale.getStatus());
        sale.setStatus(STATUS_COMPLETED);
        sale.setPayment("Tiền mặt");
        if (completing) {
            applyCompletionEffects(sale);
        }
        return salesMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    public Map<String, String> getSePayConfig() {
        return Map.of(
                "bankId", sepayBankId,
                "accountNo", sepayAccountNo,
                "accountName", sepayAccountName
        );
    }

    // ----- helpers -----

    private List<SaleItem> buildLineItems(List<SaleItemRequest> requested) {
        List<SaleItem> result = new ArrayList<>();
        if (requested == null) {
            return result;
        }
        for (SaleItemRequest item : requested) {
            if (item == null) {
                continue;
            }
            BigDecimal unit = item.unitPrice() == null ? BigDecimal.ZERO : item.unitPrice();
            int qty = item.quantity() == null ? 0 : item.quantity();
            BigDecimal lineTotal = item.lineTotal() != null
                    ? item.lineTotal()
                    : unit.multiply(BigDecimal.valueOf(qty));
            result.add(SaleItem.builder()
                    .productCode(item.productCode())
                    .productName(item.productName())
                    .unitPrice(unit)
                    .quantity(qty)
                    .lineTotal(lineTotal)
                    .build());
        }
        return result;
    }

    private void applyCashChange(Sale sale) {
        if (sale.getAmountReceived() != null && sale.getTotal() != null) {
            BigDecimal change = sale.getAmountReceived().subtract(sale.getTotal());
            sale.setChangeGiven(change.compareTo(BigDecimal.ZERO) > 0 ? change : BigDecimal.ZERO);
        }
    }

    /**
     * On a sale becoming COMPLETED: decrement product stock for every line and
     * apply loyalty (redeem then earn). Idempotent via the effectsApplied flag.
     */
    private void applyCompletionEffects(Sale sale) {
        if (sale.isEffectsApplied()) {
            return;
        }
        decrementStock(sale);
        applyLoyalty(sale);
        sale.setEffectsApplied(true);
    }

    private void decrementStock(Sale sale) {
        List<StockChangeRequest.StockLine> lines = new ArrayList<>();
        for (SaleItem item : sale.getLineItems()) {
            if (item.getProductCode() != null && item.getQuantity() != null && item.getQuantity() > 0) {
                lines.add(new StockChangeRequest.StockLine(item.getProductCode(), item.getQuantity()));
            }
        }
        if (!lines.isEmpty()) {
            productClient.decrementStock(new StockChangeRequest(lines));
        }
    }

    private void applyLoyalty(Sale sale) {
        if (sale.getCustomerCode() == null || sale.getCustomerCode().isBlank()) {
            sale.setPointsEarned(0);
            return;
        }
        Optional<Customer> customerOpt = customerRepository.findByCode(sale.getCustomerCode());
        if (customerOpt.isEmpty()) {
            sale.setPointsEarned(0);
            return;
        }
        Customer customer = customerOpt.get();
        int balance = customer.getPoints() == null ? 0 : customer.getPoints();

        // Redeem: deduct points used as a discount (clamped so balance never goes negative).
        int redeem = sale.getPointsRedeemed() == null ? 0 : sale.getPointsRedeemed();
        redeem = Math.min(redeem, balance);
        balance -= redeem;
        sale.setPointsRedeemed(redeem);

        // Earn: 1 point per 10,000 VND of the paid total (after discount).
        int earned = 0;
        if (sale.getTotal() != null) {
            earned = sale.getTotal().divide(POINT_UNIT, 0, RoundingMode.DOWN).intValue();
        }
        balance += earned;
        sale.setPointsEarned(earned);

        customer.setPoints(balance);
        if (sale.getTotal() != null) {
            BigDecimal spent = customer.getSpent() == null ? BigDecimal.ZERO : customer.getSpent();
            customer.setSpent(spent.add(sale.getTotal()));
        }
        customerRepository.save(customer);
    }

    private Sale find(UUID id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Sale not found: " + id));
    }

    private boolean isOutgoingTransfer(SePayWebhookRequest webhookData) {
        return webhookData.transferType() != null
                && !webhookData.transferType().isBlank()
                && !"in".equalsIgnoreCase(webhookData.transferType());
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String normalizeOrderCode(String rawOrderCode) {
        String normalized = rawOrderCode.toUpperCase(Locale.ROOT);
        if (normalized.startsWith("INV-")) {
            return normalized;
        }
        return "INV-" + normalized.substring(3);
    }
}
