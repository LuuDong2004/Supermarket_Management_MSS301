package com.mss301.user.service.impl;

import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.user.dto.request.AttendanceRequest;
import com.mss301.user.dto.response.AttendanceResponse;
import com.mss301.user.dto.response.TimesheetRowResponse;
import com.mss301.user.entity.Attendance;
import com.mss301.user.entity.StaffShift;
import com.mss301.user.mapper.AttendanceMapper;
import com.mss301.user.repository.AttendanceRepository;
import com.mss301.user.repository.StaffShiftRepository;
import com.mss301.user.service.interfaces.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;
    private final StaffShiftRepository staffShiftRepository;

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

    @Override
    @Transactional(readOnly = true)
    public List<TimesheetRowResponse> timesheet(LocalDate from, LocalDate to) {
        List<Attendance> records = (from != null && to != null)
                ? attendanceRepository.findByDateBetweenOrderByDateDesc(from, to)
                : attendanceRepository.findAllByOrderByDateDesc();

        // Aggregate attendance per employee.
        Map<String, int[]> agg = new LinkedHashMap<>(); // [days, hours, onTime, late, absent]
        Map<String, Set<LocalDate>> daysByEmp = new LinkedHashMap<>();
        for (Attendance a : records) {
            String emp = a.getEmployee() == null ? "—" : a.getEmployee();
            int[] row = agg.computeIfAbsent(emp, k -> new int[5]);
            daysByEmp.computeIfAbsent(emp, k -> new HashSet<>());
            if (a.getDate() != null) {
                daysByEmp.get(emp).add(a.getDate());
            }
            row[1] += a.getHours() == null ? 0 : a.getHours();
            String status = a.getStatus() == null ? "" : a.getStatus().toLowerCase();
            if (status.contains("vắng")) {
                row[4]++;
            } else if (status.contains("muộn")) {
                row[2]++; // late counter index 2 handled below
            } else {
                row[3]++; // on-time
            }
        }

        // Scheduled / completed shifts per employee in the same range.
        List<StaffShift> shifts = (from != null && to != null)
                ? staffShiftRepository.findByShiftDateBetweenOrderByShiftDateAsc(from, to)
                : staffShiftRepository.findAllByOrderByShiftDateDesc();
        Map<String, int[]> shiftAgg = new LinkedHashMap<>(); // [scheduled, completed]
        for (StaffShift s : shifts) {
            String emp = s.getEmployeeName() == null ? "—" : s.getEmployeeName();
            int[] row = shiftAgg.computeIfAbsent(emp, k -> new int[2]);
            row[0]++;
            if ("Hoàn thành".equalsIgnoreCase(s.getStatus())) {
                row[1]++;
            }
        }

        Set<String> employees = new HashSet<>(agg.keySet());
        employees.addAll(shiftAgg.keySet());

        List<TimesheetRowResponse> result = new ArrayList<>();
        for (String emp : employees) {
            int[] a = agg.getOrDefault(emp, new int[5]);
            int[] s = shiftAgg.getOrDefault(emp, new int[2]);
            int days = daysByEmp.getOrDefault(emp, Set.of()).size();
            result.add(new TimesheetRowResponse(emp, days, a[1], a[3], a[2], a[4], s[0], s[1]));
        }
        result.sort(Comparator.comparing(TimesheetRowResponse::employee));
        return result;
    }

    private Attendance findActive(UUID id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Attendance not found"));
    }
}
