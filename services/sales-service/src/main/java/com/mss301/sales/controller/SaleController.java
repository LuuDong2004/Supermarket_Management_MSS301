package com.mss301.sales.controller;

import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.request.SePayWebhookRequest;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.service.interfaces.SaleService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Sales", description = "Sales / invoice endpoints")
@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @Value("${sepay.webhook-token}")
    private String sepayWebhookToken;

    @Operation(summary = "List sales (newest first)")
    @GetMapping
    public ApiResponse<List<SaleResponse>> list() {
        return ApiResponse.success(saleService.list());
    }

    @Operation(summary = "Get a sale by id")
    @GetMapping("/{id}")
    public ApiResponse<SaleResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(saleService.getById(id));
    }

    @Operation(summary = "Create a sale")
    @PreAuthorize("hasAnyRole('CASHIER','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponse>> create(@Valid @RequestBody SaleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sale created", saleService.create(request)));
    }

    @Operation(summary = "Delete a sale")
    @PreAuthorize("hasAnyRole('ADMIN','CEO')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        saleService.delete(id);
        return ApiResponse.success("Sale deleted");
    }

    @Operation(summary = "SePay Webhook for payment confirmation")
    @PostMapping("/sepay-webhook")
    public ResponseEntity<Void> handleSePayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "token", required = false) String token,
            @RequestBody SePayWebhookRequest webhookData) {
        
        if (!isAuthorizedSePayWebhook(authHeader, token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        saleService.processSePayWebhook(webhookData);
        return ResponseEntity.ok().build();
    }

    private boolean isAuthorizedSePayWebhook(String authHeader, String token) {
        return ("Apikey " + sepayWebhookToken).equals(authHeader)
                || sepayWebhookToken.equals(token);
    }

    @Operation(summary = "Get SePay configuration")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sepay-config")
    public ApiResponse<Map<String, String>> getSePayConfig() {
        return ApiResponse.success(saleService.getSePayConfig());
    }

    @Operation(summary = "Update sale status")
    @PutMapping("/{id}/status")
    public ApiResponse<SaleResponse> updateStatus(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ApiResponse.success("Sale status updated", saleService.updateStatus(id, status));
    }

    @Operation(summary = "Transition a pending sale to cash payment")
    @PutMapping("/{id}/complete-cash")
    public ApiResponse<SaleResponse> completeCashSale(@PathVariable UUID id) {
        return ApiResponse.success("Sale completed with cash", saleService.completeCashSale(id));
    }
}
