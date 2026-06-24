package com.mss301.product.mapper;

import com.mss301.product.dto.request.ProductRequest;
import com.mss301.product.dto.request.PromotionRequest;
import com.mss301.product.dto.request.VoucherRequest;
import com.mss301.product.dto.response.ProductResponse;
import com.mss301.product.dto.response.PromotionResponse;
import com.mss301.product.dto.response.VoucherResponse;
import com.mss301.product.entity.Product;
import com.mss301.product.entity.Promotion;
import com.mss301.product.entity.Voucher;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // ----- Product -----
    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Product toEntity(ProductRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Product product, ProductRequest request);

    // ----- Promotion -----
    PromotionResponse toResponse(Promotion promotion);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Promotion toEntity(PromotionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Promotion promotion, PromotionRequest request);

    // ----- Voucher -----
    VoucherResponse toResponse(Voucher voucher);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Voucher toEntity(VoucherRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget Voucher voucher, VoucherRequest request);
}
