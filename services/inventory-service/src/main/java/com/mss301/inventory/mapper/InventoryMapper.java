package com.mss301.inventory.mapper;

import com.mss301.inventory.dto.request.InventoryItemRequest;
import com.mss301.inventory.dto.request.StockAdjustmentRequest;
import com.mss301.inventory.dto.request.StockCountRequest;
import com.mss301.inventory.dto.request.WarehouseTransactionRequest;
import com.mss301.inventory.dto.response.InventoryItemResponse;
import com.mss301.inventory.dto.response.StockAdjustmentResponse;
import com.mss301.inventory.dto.response.StockCountResponse;
import com.mss301.inventory.dto.response.WarehouseTransactionResponse;
import com.mss301.inventory.entity.InventoryItem;
import com.mss301.inventory.entity.StockAdjustment;
import com.mss301.inventory.entity.StockCount;
import com.mss301.inventory.entity.WarehouseTransaction;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

    // ----- InventoryItem -----
    InventoryItemResponse toResponse(InventoryItem item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    InventoryItem toEntity(InventoryItemRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget InventoryItem item, InventoryItemRequest request);

    // ----- WarehouseTransaction -----
    WarehouseTransactionResponse toResponse(WarehouseTransaction transaction);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    WarehouseTransaction toEntity(WarehouseTransactionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget WarehouseTransaction transaction, WarehouseTransactionRequest request);

    // ----- StockAdjustment -----
    StockAdjustmentResponse toResponse(StockAdjustment adjustment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    StockAdjustment toEntity(StockAdjustmentRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget StockAdjustment adjustment, StockAdjustmentRequest request);

    // ----- StockCount -----
    StockCountResponse toResponse(StockCount count);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    StockCount toEntity(StockCountRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget StockCount count, StockCountRequest request);
}
