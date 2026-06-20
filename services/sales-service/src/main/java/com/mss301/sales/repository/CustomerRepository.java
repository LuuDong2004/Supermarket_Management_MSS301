package com.mss301.sales.repository;

import com.mss301.sales.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    boolean existsByCode(String code);

    Optional<Customer> findByPhone(String phone);

    Page<Customer> findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String name, String phone, Pageable pageable);
}
