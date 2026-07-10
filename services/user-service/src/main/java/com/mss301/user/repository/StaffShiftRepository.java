package com.mss301.user.repository;

import com.mss301.user.entity.StaffShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface StaffShiftRepository extends JpaRepository<StaffShift, UUID> {

    boolean existsByCode(String code);

    boolean existsByEmployeeCodeAndShiftDate(String employeeCode, LocalDate shiftDate);

    /** Same-day conflict check that excludes the row being edited. */
    boolean existsByEmployeeCodeAndShiftDateAndIdNot(String employeeCode, LocalDate shiftDate, java.util.UUID id);

    List<StaffShift> findByShiftDateBetweenOrderByShiftDateAsc(LocalDate from, LocalDate to);

    List<StaffShift> findAllByOrderByShiftDateDesc();
}
