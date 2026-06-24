package com.mss301.notification.mapper;

import com.mss301.notification.dto.request.ApprovalRequestRequest;
import com.mss301.notification.dto.request.BusinessPolicyRequest;
import com.mss301.notification.dto.request.NotificationRequest;
import com.mss301.notification.dto.request.SettingRequest;
import com.mss301.notification.dto.response.ApprovalRequestResponse;
import com.mss301.notification.dto.response.BusinessPolicyResponse;
import com.mss301.notification.dto.response.NotificationResponse;
import com.mss301.notification.dto.response.SettingResponse;
import com.mss301.notification.entity.ApprovalRequest;
import com.mss301.notification.entity.BusinessPolicy;
import com.mss301.notification.entity.Notification;
import com.mss301.notification.entity.SystemSetting;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    // ----- ApprovalRequest -----
    ApprovalRequestResponse toResponse(ApprovalRequest approvalRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    ApprovalRequest toEntity(ApprovalRequestRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget ApprovalRequest approvalRequest, ApprovalRequestRequest request);

    // ----- BusinessPolicy -----
    BusinessPolicyResponse toResponse(BusinessPolicy businessPolicy);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    BusinessPolicy toEntity(BusinessPolicyRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget BusinessPolicy businessPolicy, BusinessPolicyRequest request);

    // ----- Notification -----
    NotificationResponse toResponse(Notification notification);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "readFlag", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Notification toEntity(NotificationRequest request);

    // ----- SystemSetting -----
    SettingResponse toResponse(SystemSetting systemSetting);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    SystemSetting toEntity(SettingRequest request);
}
