package com.mss301.user.service.impl;

import com.mss301.common.exception.BadRequestException;
import com.mss301.common.exception.ConflictException;
import com.mss301.common.exception.ErrorCode;
import com.mss301.common.exception.ResourceNotFoundException;
import com.mss301.user.dto.request.StaffShiftRequest;
import com.mss301.user.dto.response.StaffShiftResponse;
import com.mss301.user.entity.Employee;
import com.mss301.user.entity.StaffShift;
import com.mss301.user.mapper.StaffShiftMapper;
import com.mss301.user.repository.EmployeeRepository;
import com.mss301.user.repository.StaffShiftRepository;
import com.mss301.user.service.interfaces.StaffShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffShiftServiceImpl implements StaffShiftService {

    // Default time windows per shift type (BR-02).
    private static final Map<String, String[]> SHIFT_TIMES = Map.of(
            "Sáng", new String[]{"06:00", "14:00"},
            "Chiều", new String[]{"14:00", "22:00"},
            "Đêm", new String[]{"22:00", "06:00"}
    );

    private final StaffShiftRepository staffShiftRepository;
    private final EmployeeRepository employeeRepository;
    private final StaffShiftMapper staffShiftMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StaffShiftResponse> list(LocalDate from, LocalDate to) {
        List<StaffShift> shifts = (from != null && to != null)
                ? staffShiftRepository.findByShiftDateBetweenOrderByShiftDateAsc(from, to)
                : staffShiftRepository.findAllByOrderByShiftDateDesc();
        return shifts.stream().map(staffShiftMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StaffShiftResponse getById(UUID id) {
        return staffShiftMapper.toResponse(find(id));
    }

    @Override
    public StaffShiftResponse create(StaffShiftRequest request) {
        StaffShift shift = staffShiftMapper.toEntity(request);

        assignCode(shift, request);
        applyDefaultTimes(shift);
        guardActiveEmployee(shift.getEmployeeCode());

        // BR-01: one shift per employee per date.
        if (shift.getEmployeeCode() != null
                && staffShiftRepository.existsByEmployeeCodeAndShiftDate(shift.getEmployeeCode(), shift.getShiftDate())) {
            throw new ConflictException(ErrorCode.CONFLICT,
                    "Trùng ca: " + shift.getEmployeeName() + " đã có ca trong ngày " + shift.getShiftDate());
        }
        if (shift.getStatus() == null || shift.getStatus().isBlank()) {
            shift.setStatus("Lên lịch");
        }
        return staffShiftMapper.toResponse(staffShiftRepository.save(shift));
    }

    @Override
    public StaffShiftResponse update(UUID id, StaffShiftRequest request) {
        StaffShift shift = find(id);
        // BR-03: past shifts cannot be modified.
        if (shift.getShiftDate() != null && shift.getShiftDate().isBefore(LocalDate.now())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Không thể sửa ca đã qua.");
        }
        String prevEmp = shift.getEmployeeCode();
        LocalDate prevDate = shift.getShiftDate();

        staffShiftMapper.update(shift, request);
        applyDefaultTimes(shift);
        guardActiveEmployee(shift.getEmployeeCode());

        // Re-check conflict only if employee or date changed. Exclude this row
        // (id) so the shift being edited never conflicts with itself — Hibernate
        // auto-flushes the mutation before the query runs.
        boolean changed = (shift.getEmployeeCode() != null && !shift.getEmployeeCode().equals(prevEmp))
                || (shift.getShiftDate() != null && !shift.getShiftDate().equals(prevDate));
        if (changed && shift.getEmployeeCode() != null
                && staffShiftRepository.existsByEmployeeCodeAndShiftDateAndIdNot(
                        shift.getEmployeeCode(), shift.getShiftDate(), shift.getId())) {
            throw new ConflictException(ErrorCode.CONFLICT,
                    "Trùng ca: " + shift.getEmployeeName() + " đã có ca trong ngày " + shift.getShiftDate());
        }
        return staffShiftMapper.toResponse(shift);
    }

    @Override
    public StaffShiftResponse complete(UUID id) {
        StaffShift shift = find(id);
        shift.setStatus("Hoàn thành");
        return staffShiftMapper.toResponse(shift);
    }

    @Override
    public void delete(UUID id) {
        StaffShift shift = find(id);
        // BR-03: past shifts cannot be deleted.
        if (shift.getShiftDate() != null && shift.getShiftDate().isBefore(LocalDate.now())) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Không thể xóa ca đã qua.");
        }
        staffShiftRepository.delete(shift);
    }

    // ----- helpers -----

    private void assignCode(StaffShift shift, StaffShiftRequest request) {
        String code = request.code();
        if (code == null || code.isBlank()) {
            code = "SHF-" + System.currentTimeMillis();
        }
        if (staffShiftRepository.existsByCode(code)) {
            throw new ConflictException(ErrorCode.CONFLICT, "Mã ca đã tồn tại: " + code);
        }
        shift.setCode(code);
    }

    private void applyDefaultTimes(StaffShift shift) {
        String[] times = SHIFT_TIMES.get(shift.getShiftType());
        if (times != null) {
            if (shift.getStartTime() == null || shift.getStartTime().isBlank()) {
                shift.setStartTime(times[0]);
            }
            if (shift.getEndTime() == null || shift.getEndTime().isBlank()) {
                shift.setEndTime(times[1]);
            }
        }
    }

    /** BR-04: deactivated staff cannot be assigned shifts. */
    private void guardActiveEmployee(String employeeCode) {
        if (employeeCode == null || employeeCode.isBlank()) {
            return;
        }
        Optional<Employee> emp = employeeRepository.findByCode(employeeCode);
        emp.ifPresent(e -> {
            String status = e.getStatus() == null ? "" : e.getStatus().toLowerCase();
            if (status.contains("nghỉ") || status.contains("inactive")) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST,
                        "Nhân viên đã ngừng làm việc, không thể phân ca: " + e.getName());
            }
        });
    }

    private StaffShift find(UUID id) {
        return staffShiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Shift not found: " + id));
    }
}
