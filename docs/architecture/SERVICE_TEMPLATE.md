# Service Template

Copy this when adding a new microservice (e.g. `product-service`). Replace
`{service}` with the lowercase name and `{Service}` with the PascalCase name.

## Folder structure

```
services/{service}-service/
├── src/main/java/com/mss301/{service}/
│   ├── config/                 # SecurityConfig, OpenApiConfig, etc.
│   ├── controller/             # REST endpoints (return ApiResponse<T>)
│   ├── service/
│   │   ├── interfaces/         # {Service}Service
│   │   └── impl/               # {Service}ServiceImpl
│   ├── repository/             # Spring Data JPA
│   ├── entity/                 # JPA entities (owned by THIS service only)
│   ├── dto/
│   │   ├── request/            # *Request records
│   │   └── response/           # *Response records
│   ├── mapper/                 # MapStruct mappers
│   ├── security/               # principals / helpers
│   ├── filter/                 # servlet filters (e.g. HeaderAuthenticationFilter)
│   ├── exception/              # service-specific exceptions (shared ones in common-lib)
│   ├── validation/             # custom validators
│   ├── util/                   # helpers
│   └── {Service}Application.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/           # Flyway V1__*.sql ...
├── Dockerfile
├── pom.xml
└── README.md
```

## Example `pom.xml`

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.mss301</groupId>
        <artifactId>supermarket-management</artifactId>
        <version>1.0.0</version>
        <relativePath>../../pom.xml</relativePath>
    </parent>
    <artifactId>{service}-service</artifactId>

    <dependencies>
        <!-- Shared libraries -->
        <dependency><groupId>com.mss301</groupId><artifactId>common-lib</artifactId></dependency>
        <dependency><groupId>com.mss301</groupId><artifactId>api-response-lib</artifactId></dependency>
        <dependency><groupId>com.mss301</groupId><artifactId>security-lib</artifactId></dependency>
        <dependency><groupId>com.mss301</groupId><artifactId>event-lib</artifactId></dependency>

        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
        <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>

        <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
        <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
        <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>

        <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId><version>${springdoc.version}</version></dependency>
        <dependency><groupId>org.mapstruct</groupId><artifactId>mapstruct</artifactId></dependency>
        <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><version>${lombok.version}</version><scope>provided</scope></dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
        </plugins>
    </build>
</project>
```

## Main class

```java
@EnableJpaAuditing
@SpringBootApplication(scanBasePackages = {"com.mss301.{service}", "com.mss301.response"})
public class {Service}Application {
    public static void main(String[] args) {
        SpringApplication.run({Service}Application.class, args);
    }
}
```

## Activation checklist

1. Add `<module>services/{service}-service</module>` to root `pom.xml`.
2. Add a gateway route `Path=/api/{plural}/**`.
3. Add a `{service}-service` block + database to `docker-compose.yml` and the
   `infrastructure/postgres/init` script.
