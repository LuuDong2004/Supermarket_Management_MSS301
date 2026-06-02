package com.mss301.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Scan security-lib so the shared JwtTokenProvider bean is discovered.
@SpringBootApplication(scanBasePackages = {"com.mss301.gateway", "com.mss301.security"})
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
