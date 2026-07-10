package com.mss301.supplier.mapper;

import com.mss301.supplier.dto.request.PurchaseOrderRequest;
import com.mss301.supplier.dto.request.SupplierPriceItemRequest;
import com.mss301.supplier.dto.request.SupplierRequest;
import com.mss301.supplier.dto.response.PurchaseOrderResponse;
import com.mss301.supplier.dto.response.SupplierPriceItemResponse;
import com.mss301.supplier.dto.response.SupplierResponse;
import com.mss301.supplier.entity.PurchaseOrder;
import com.mss301.supplier.entity.Supplier;
import com.mss301.supplier.entity.SupplierPriceItem;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    // ----- Supplier -----
    SupplierResponse toResponse(Supplier supplier);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Supplier toEntity(SupplierRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Supplier supplier, SupplierRequest request);

    // ----- PurchaseOrder -----
    PurchaseOrderResponse toResponse(PurchaseOrder purchaseOrder);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    PurchaseOrder toEntity(PurchaseOrderRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget PurchaseOrder purchaseOrder, PurchaseOrderRequest request);

    // ----- SupplierPriceItem -----
    SupplierPriceItemResponse toResponse(SupplierPriceItem item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    SupplierPriceItem toEntity(SupplierPriceItemRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget SupplierPriceItem item, SupplierPriceItemRequest request);
}
