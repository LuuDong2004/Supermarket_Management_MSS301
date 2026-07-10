package com.mss301.sales.mapper;

import com.mss301.sales.dto.request.CustomerRequest;
import com.mss301.sales.dto.request.SaleRequest;
import com.mss301.sales.dto.request.ShiftRequest;
import com.mss301.sales.dto.response.CustomerResponse;
import com.mss301.sales.dto.response.ReturnResponse;
import com.mss301.sales.dto.response.SaleResponse;
import com.mss301.sales.dto.response.ShiftResponse;
import com.mss301.sales.entity.Customer;
import com.mss301.sales.entity.Sale;
import com.mss301.sales.entity.SaleReturn;
import com.mss301.sales.entity.Shift;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SalesMapper {

    // ----- Sale -----
    SaleResponse toResponse(Sale sale);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lineItems", ignore = true)
    @Mapping(target = "changeGiven", ignore = true)
    @Mapping(target = "pointsEarned", ignore = true)
    @Mapping(target = "effectsApplied", ignore = true)
    Sale toEntity(SaleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Sale sale, SaleRequest request);

    // ----- Shift -----
    ShiftResponse toResponse(Shift shift);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Shift toEntity(ShiftRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Shift shift, ShiftRequest request);

    // ----- Return / Refund -----
    ReturnResponse toResponse(SaleReturn saleReturn);

    // ----- Customer -----
    CustomerResponse toResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Customer toEntity(CustomerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Customer customer, CustomerRequest request);
}
