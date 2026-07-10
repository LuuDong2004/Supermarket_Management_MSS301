package com.mss301.user.mapper;

import com.mss301.user.dto.request.StaffShiftRequest;
import com.mss301.user.dto.response.StaffShiftResponse;
import com.mss301.user.entity.StaffShift;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface StaffShiftMapper {

    StaffShiftResponse toResponse(StaffShift shift);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    StaffShift toEntity(StaffShiftRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget StaffShift shift, StaffShiftRequest request);
}
