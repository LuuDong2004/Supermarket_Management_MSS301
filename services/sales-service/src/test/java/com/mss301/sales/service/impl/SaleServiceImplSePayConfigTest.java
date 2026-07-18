package com.mss301.sales.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mss301.sales.client.ProductClient;
import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.mapper.SalesMapper;
import com.mss301.sales.repository.CustomerRepository;
import com.mss301.sales.repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SaleServiceImplSePayConfigTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withBean(SaleRepository.class, () -> mock(SaleRepository.class))
            .withBean(CustomerRepository.class, () -> mock(CustomerRepository.class))
            .withBean(SalesMapper.class, () -> mock(SalesMapper.class))
            .withBean(ProductClient.class, () -> mock(ProductClient.class))
            .withBean(SaleServiceImpl.class);

    @Test
    void defaultSePayConfigUsesPlaceholderAccountUntilEnvSuppliesTheRealOne() {
        contextRunner.run(context -> assertThat(context.getBean(SaleServiceImpl.class).getSePayConfig())
                .containsEntry("bankId", "MB")
                .containsEntry("accountNo", "0000000000")
                .containsEntry("accountName", "DEMO ACCOUNT"));
    }

    @Test
    void sePayWebhookPayloadCompletesPendingSaleWhenBankContentDropsDashFromInvoiceCode() throws Exception {
        String payload = """
                {
                  "gateway": "MBBank",
                  "transactionDate": "2026-07-07 21:58:00",
                  "accountNumber": "0369666456",
                  "subAccount": null,
                  "code": null,
                  "content": "INV1783436275851 I21UGGZX/134734",
                  "transferType": "in",
                  "description": "BankAPINotify INV1783436275851 I21UGGZX/134734",
                  "transferAmount": 115000,
                  "referenceCode": "FT26189039809374",
                  "accumulated": 0,
                  "id": 67046585
                }
                """;
        SePayWebhookRequest request = new ObjectMapper().readValue(payload, SePayWebhookRequest.class);
        SaleRepository saleRepository = mock(SaleRepository.class);
        Sale pendingSale = Sale.builder()
                .id(UUID.randomUUID())
                .code("INV-1783436275851")
                .items(1)
                .total(new BigDecimal("115000"))
                .payment("QR Code")
                .status("PENDING")
                .build();
        when(saleRepository.findByCode("INV-1783436275851")).thenReturn(Optional.of(pendingSale));

        new SaleServiceImpl(saleRepository, mock(CustomerRepository.class), mock(SalesMapper.class), mock(ProductClient.class))
                .processSePayWebhook(request);

        assertThat(pendingSale.getStatus()).isEqualTo("COMPLETED");
        verify(saleRepository).save(pendingSale);
    }
}
