package com.mss301.notification.service.interfaces;

import com.mss301.notification.dto.request.SettingRequest;
import com.mss301.notification.dto.response.SettingResponse;

import java.util.List;

public interface SystemSettingService {

    List<SettingResponse> list();

    SettingResponse getByKey(String settingKey);

    SettingResponse create(SettingRequest request);

    SettingResponse updateValue(String settingKey, String value);
}
