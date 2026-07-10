package com.mss301.user.service.interfaces;

import com.mss301.user.dto.request.StaffShiftRequest;
import com.mss301.user.dto.response.StaffShiftResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface StaffShiftService {

    List<StaffShiftResponse> list(LocalDate from, LocalDate to);

    StaffShiftResponse getById(UUID id);

    StaffShiftResponse create(StaffShiftRequest request);

    StaffShiftResponse update(UUID id, StaffShiftRequest request);

    StaffShiftResponse complete(UUID id);

    void delete(UUID id);
}
