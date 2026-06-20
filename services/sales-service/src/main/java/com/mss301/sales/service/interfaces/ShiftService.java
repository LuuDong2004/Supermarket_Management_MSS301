package com.mss301.sales.service.interfaces;

import com.mss301.sales.dto.request.ShiftRequest;
import com.mss301.sales.dto.response.ShiftResponse;

import java.util.List;
import java.util.UUID;

public interface ShiftService {

    ShiftResponse create(ShiftRequest request);

    ShiftResponse update(UUID id, ShiftRequest request);

    ShiftResponse getById(UUID id);

    List<ShiftResponse> list();

    void delete(UUID id);
}
