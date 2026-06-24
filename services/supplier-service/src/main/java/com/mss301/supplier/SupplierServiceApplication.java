package com.mss301.supplier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
// Scan api-response-lib so the shared GlobalExceptionHandler is registered.
@SpringBootApplication(scanBasePackages = {"com.mss301.supplier", "com.mss301.response"})
public class SupplierServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupplierServiceApplication.class, args);
    }
}
