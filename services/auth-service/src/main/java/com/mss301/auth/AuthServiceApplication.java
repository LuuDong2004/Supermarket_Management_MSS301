package com.mss301.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@EnableFeignClients
// Scan security-lib (JwtTokenProvider) and api-response-lib (GlobalExceptionHandler).
@SpringBootApplication(scanBasePackages = {"com.mss301.auth", "com.mss301.security", "com.mss301.response"})
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
