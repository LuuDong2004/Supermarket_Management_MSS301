package com.mss301.user.repository;

import com.mss301.user.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    boolean existsByCode(String code);

    List<Attendance> findByDateOrderByDateDesc(LocalDate date);

    List<Attendance> findByDateBetweenOrderByDateDesc(LocalDate from, LocalDate to);

    List<Attendance> findAllByOrderByDateDesc();
}
