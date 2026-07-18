package com.mss301.user.service.impl;

import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.user.dto.request.FeaturePermissionRequest;
import com.mss301.user.dto.response.FeaturePermissionResponse;
import com.mss301.user.entity.FeaturePermission;
import com.mss301.user.repository.FeaturePermissionRepository;
import com.mss301.user.service.interfaces.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final FeaturePermissionRepository featurePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FeaturePermissionResponse> list() {
        return featurePermissionRepository.findAllByOrderBySeqAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public FeaturePermissionResponse update(UUID id, FeaturePermissionRequest request) {
        FeaturePermission fp = featurePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Feature permission not found: " + id));
        fp.setCeo(request.ceo());
        fp.setAdmin(request.admin());
        fp.setWarehouseManager(request.warehouseManager());
        fp.setWarehouseStaff(request.warehouseStaff());
        fp.setStaffManager(request.staffManager());
        fp.setCashier(request.cashier());
        return toResponse(fp);
    }

    private FeaturePermissionResponse toResponse(FeaturePermission fp) {
        return new FeaturePermissionResponse(
                fp.getId(),
                fp.getFeatureCode(),
                fp.getFeatureName(),
                fp.getCategory(),
                fp.isCeo(),
                fp.isAdmin(),
                fp.isWarehouseManager(),
                fp.isWarehouseStaff(),
                fp.isStaffManager(),
                fp.isCashier()
        );
    }
}
