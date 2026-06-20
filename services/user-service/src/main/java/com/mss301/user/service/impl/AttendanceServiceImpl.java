package com.mss301.user.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.user.dto.request.AttendanceRequest;
import com.mss301.user.dto.response.AttendanceResponse;
import com.mss301.user.entity.Attendance;
import com.mss301.user.mapper.AttendanceMapper;
import com.mss301.user.repository.AttendanceRepository;
import com.mss301.user.service.interfaces.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAll(LocalDate date) {
        List<Attendance> source = (date == null)
                ? attendanceRepository.findAllByOrderByDateDesc()
                : attendanceRepository.findByDateOrderByDateDesc(date);
        return source.stream().map(attendanceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getById(UUID id) {
        return attendanceMapper.toResponse(findActive(id));
    }

    @Override
    public AttendanceResponse create(AttendanceRequest request) {
        if (attendanceRepository.existsByCode(request.code())) {
            throw new ConflictException(ErrorCode.CONFLICT, "Attendance code already exists");
        }
        Attendance attendance = attendanceMapper.toEntity(request);
        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponse update(UUID id, AttendanceRequest request) {
        Attendance attendance = findActive(id);
        attendanceMapper.update(attendance, request);
        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public void softDelete(UUID id) {
        Attendance attendance = findActive(id);
        attendanceRepository.delete(attendance); // @SQLDelete flips the deleted flag
    }

    private Attendance findActive(UUID id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Attendance not found"));
    }
}
