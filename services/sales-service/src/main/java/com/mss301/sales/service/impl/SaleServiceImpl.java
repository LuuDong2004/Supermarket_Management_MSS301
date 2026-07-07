package com.mss301.sales.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.SaleRepository;
import com.mss301.sales.service.interfaces.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("\\bINV-?\\d+\\b", Pattern.CASE_INSENSITIVE);

    private final SaleRepository saleRepository;
    private final SalesMapper salesMapper;

    @Value("${sepay.bank-id:MB}")
    private String sepayBankId;

    @Value("${sepay.account-no:0369666456}")
    private String sepayAccountNo;

    @Value("${sepay.account-name:NGUYEN DUY THANG}")
    private String sepayAccountName;

    @Override
    public SaleResponse create(SaleRequest request) {
        if (saleRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Sale code already exists: " + request.code());
        }
        Sale sale = salesMapper.toEntity(request);
        if (sale.getStatus() == null || sale.getStatus().isBlank()) {
            if ("QR Code".equalsIgnoreCase(sale.getPayment()) || "SePay".equalsIgnoreCase(sale.getPayment())) {
                sale.setStatus("PENDING");
            } else {
                sale.setStatus("COMPLETED");
            }
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
                if ("PENDING".equals(sale.getStatus())) {
                    if (paidAmount.compareTo(sale.getTotal()) >= 0) {
                        sale.setStatus("COMPLETED");
                        saleRepository.save(sale);
                    }
                }
            }
        }
    }

    @Override
    public SaleResponse updateStatus(UUID id, String status) {
        Sale sale = find(id);
        sale.setStatus(status);
        return salesMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    public SaleResponse completeCashSale(UUID id) {
        Sale sale = find(id);
        sale.setStatus("COMPLETED");
        sale.setPayment("Tiền mặt");
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
