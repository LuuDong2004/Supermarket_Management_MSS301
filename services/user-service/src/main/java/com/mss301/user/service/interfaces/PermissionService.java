package com.mss301.user.service.interfaces;

import com.mss301.user.dto.request.FeaturePermissionRequest;
import com.mss301.user.dto.response.FeaturePermissionResponse;

import java.util.List;
import java.util.UUID;

public interface PermissionService {

    List<FeaturePermissionResponse> list();

    FeaturePermissionResponse update(UUID id, FeaturePermissionRequest request);
}
