# Architecture Overview

## Layout

```
SUPERMARKET_MANAGEMENT/
├── services/          deployable business microservices
├── shared/            internal libraries (no entities, no DB)
├── infrastructure/    registry + ops assets (docker/mysql/redis/rabbitmq/monitoring)
├── docs/              architecture, api, database, diagrams
├── scripts/           Windows dev scripts
├── pom.xml            aggregator + dependency/plugin management
└── docker-compose.yml dev stack
```

## Module map

| Group            | Module             | Java root              | Notes                                  |
|------------------|--------------------|------------------------|----------------------------------------|
| shared           | `common-lib`       | `com.mss301.common`    | enums, constants, ErrorCode, exceptions, cross-service DTOs |
| shared           | `api-response-lib` | `com.mss301.response`  | `ApiResponse`, `ErrorResponse`, `PageResponse`, `GlobalExceptionHandler` |
| shared           | `security-lib`     | `com.mss301.security`  | `JwtTokenProvider`, `JwtProperties`, security constants, gateway headers |
| shared           | `event-lib`        | `com.mss301.event`     | async event contracts (RabbitMQ/Kafka) |
| infrastructure   | `discovery-server` | `com.mss301.discovery` | Eureka registry                        |
| services         | `api-gateway`      | `com.mss301.gateway`   | edge routing + JWT validation          |
| services         | `auth-service`     | `com.mss301.auth`      | tokens, refresh, credential checks     |
| services         | `user-service`     | `com.mss301.user`      | user CRUD, source of truth for users   |

## Dependency direction (no cycles)

```
event-lib            (standalone)
common-lib           (standalone, optional spring-web)
api-response-lib  ──▶ common-lib
security-lib      ──▶ common-lib
services          ──▶ common-lib, api-response-lib, security-lib, event-lib
```

Rules:
- **Shared libraries never depend on services.**
- **No JPA entities in `shared/`.** Each service owns its schema and entities.
- A service may call another only through a published contract (OpenFeign DTOs
  in `common-lib`, or async events in `event-lib`) — never a shared DB table.

## Request flow

1. Client → `api-gateway` with `Authorization: Bearer <accessToken>`.
2. Gateway validates the JWT once (`security-lib` `JwtTokenProvider`), strips any
   spoofed identity headers, and forwards `X-User-Id / X-Username / X-Roles`.
3. Downstream services rebuild the `Authentication` from those headers and apply
   `@PreAuthorize` RBAC.
4. `auth-service` ↔ `user-service` talk over OpenFeign + Eureka on non-routed
   `/internal/**` endpoints guarded by a shared `X-Internal-Api-Key`.

## Package naming conventions

- Shared lib root: `com.mss301.<lib>` (`common`, `response`, `security`, `event`).
- Service root: `com.mss301.<service>` (`gateway`, `auth`, `user`, `product`, …).
- Within a service:
  `config`, `controller`, `service.interfaces`, `service.impl`, `repository`,
  `entity`, `dto.request`, `dto.response`, `mapper`, `security`, `filter`,
  `exception`, `validation`, `util`.
- One public type per file; interfaces in `service.interfaces`, implementations
  in `service.impl` suffixed `*Impl`.

## Best practices applied

- **Constructor injection only** (no field injection); Lombok `@RequiredArgsConstructor`.
- **Records for DTOs**, split into `request` / `response`.
- **Centralized error handling** via one `GlobalExceptionHandler` in `api-response-lib`,
  reused by every web service (scanned through `com.mss301.response`).
- **No duplicated JWT logic** — a single `JwtTokenProvider` issues (auth) and
  verifies (gateway) tokens.
- **DB-per-service**, Flyway-managed migrations per service.
- **Stateless** auth; short-lived JWT access tokens + rotated, hashed refresh tokens.
- **Externalized config** via env vars; secrets are dev-only defaults.
