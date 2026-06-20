package com.mss301.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
// Scan api-response-lib so the shared GlobalExceptionHandler is registered.
@SpringBootApplication(scanBasePackages = {"com.mss301.inventory", "com.mss301.response"})
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}
