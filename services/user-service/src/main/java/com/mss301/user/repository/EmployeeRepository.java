package com.mss301.user.repository;

import com.mss301.user.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    boolean existsByCode(String code);

    Page<Employee> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
