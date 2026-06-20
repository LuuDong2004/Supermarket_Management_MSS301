package com.mss301.reporting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
// Scan api-response-lib so the shared GlobalExceptionHandler is registered.
@SpringBootApplication(scanBasePackages = {"com.mss301.reporting", "com.mss301.response"})
public class ReportingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportingServiceApplication.class, args);
    }
}
