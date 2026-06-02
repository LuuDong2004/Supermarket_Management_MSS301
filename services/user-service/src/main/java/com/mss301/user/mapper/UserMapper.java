package com.mss301.user.mapper;

import com.mss301.common.dto.internal.InternalUserResponse;
import com.mss301.user.dto.response.UserResponse;
import com.mss301.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    @Mapping(target = "id", expression = "java(user.getId().toString())")
    @Mapping(target = "passwordHash", source = "password")
    InternalUserResponse toInternalResponse(User user);
}
