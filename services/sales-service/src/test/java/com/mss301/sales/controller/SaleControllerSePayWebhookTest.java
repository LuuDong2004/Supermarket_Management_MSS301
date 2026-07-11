package com.mss301.sales.controller;

import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.service.interfaces.SaleService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class SaleControllerSePayWebhookTest {

    @Test
    void acceptsWebhookTokenFromQueryStringWhenAuthorizationHeaderIsUnavailable() {
        SaleService saleService = mock(SaleService.class);
        SaleController controller = new SaleController(saleService);
        ReflectionTestUtils.setField(controller, "sepayWebhookToken", "dev-token");
        SePayWebhookRequest webhook = new SePayWebhookRequest(
                67049590L,
                "MBBank",
                "2026-07-07 22:17:00",
                "0000000000",
                null,
                new BigDecimal("18000"),
                null,
                BigDecimal.ZERO,
                null,
                "INV1783437465832 I21UKR22/247644",
                "FT26189046302753",
                null,
                "in"
        );

        var response = controller.handleSePayWebhook(null, "dev-token", webhook);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(saleService).processSePayWebhook(webhook);
    }
}
