package com.mss301.reporting.service.interfaces;

import com.mss301.reporting.dto.response.SecurityAlertResponse;

import java.util.List;
import java.util.UUID;

public interface SecurityAlertService {

    List<SecurityAlertResponse> list();

    SecurityAlertResponse resolve(UUID id);
}
