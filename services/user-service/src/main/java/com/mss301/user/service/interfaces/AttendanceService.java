package com.mss301.user.service.interfaces;

import com.mss301.user.dto.request.AttendanceRequest;
import com.mss301.user.dto.response.AttendanceResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceService {

    List<AttendanceResponse> getAll(LocalDate date);

    AttendanceResponse getById(UUID id);

    AttendanceResponse create(AttendanceRequest request);

    AttendanceResponse update(UUID id, AttendanceRequest request);

    void softDelete(UUID id);
}
