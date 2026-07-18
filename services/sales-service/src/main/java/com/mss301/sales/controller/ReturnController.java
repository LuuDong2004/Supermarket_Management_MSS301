package com.mss301.sales.controller;

import com.mss301.response.ApiResponse;
import com.mss301.sales.dto.request.ReturnRequest;
import com.mss301.sales.dto.response.ReturnResponse;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.service.interfaces.ReturnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Returns", description = "Return / refund endpoints")
@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @Operation(summary = "List returns (newest first)")
    @GetMapping
    public ApiResponse<List<ReturnResponse>> list() {
        return ApiResponse.success(returnService.list());
    }

    @Operation(summary = "Look up an original sale by code to base a return on")
    @GetMapping("/lookup")
    public ApiResponse<SaleResponse> lookup(@RequestParam String code) {
        return ApiResponse.success(returnService.lookupSale(code));
    }

    @Operation(summary = "Get a return by id")
    @GetMapping("/{id}")
    public ApiResponse<ReturnResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(returnService.getById(id));
    }

    @Operation(summary = "Create a return / refund")
    @PreAuthorize("hasRole('CASHIER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ReturnResponse>> create(@Valid @RequestBody ReturnRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Return created", returnService.create(request)));
    }
}
