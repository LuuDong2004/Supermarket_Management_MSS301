# MSS301 — Supermarket Management Platform (Backend)

Enterprise-structured microservice backend for the MSS301 capstone. It delivers
the platform foundation — API Gateway, Auth Service, User Service, four shared
libraries and an Eureka registry — plus the full business layer: **product,
inventory, sales, supplier, reporting and notification** services, each owning its
own database and seeded to mirror the frontend contract.

> Stack: Java 21 · Spring Boot 3.5 · Spring Cloud 2025.0.0 · Spring Security 6 ·
> Spring Cloud Gateway · Spring Data JPA · PostgreSQL · Flyway · JWT · MapStruct ·
> Lombok · OpenFeign · Docker.

---

## 1. Repository layout

```
SUPERMARKET_MANAGEMENT/
├── services/                 deployable business microservices
│   ├── api-gateway/          :8080  edge routing + JWT validation
│   ├── auth-service/         :8081  tokens, refresh, credential checks
│   ├── user-service/         :8082  user CRUD (source of truth) + HR (employees, attendance)
│   ├── product-service/      :8083  products, promotions, vouchers
│   ├── inventory-service/    :8084  inventory, warehouse txns, adjustments, stock counts
│   ├── sales-service/        :8085  sales, shifts, members/loyalty
│   ├── reporting-service/    :8086  reports, analytics, system monitoring
│   ├── supplier-service/     :8087  suppliers, purchase orders
│   └── notification-service/ :8088  approvals, notifications, policies, settings
│
├── shared/                   internal libraries (NO entities, NO DB)
│   ├── common-lib/           com.mss301.common   enums, constants, ErrorCode, exceptions, Feign DTOs
│   ├── api-response-lib/     com.mss301.response  ApiResponse, ErrorResponse, PageResponse, GlobalExceptionHandler
│   ├── security-lib/         com.mss301.security  JwtTokenProvider, JwtProperties, security constants
│   └── event-lib/            com.mss301.event     async event contracts
│
├── infrastructure/
│   ├── discovery-server/     :8761  Eureka registry
│   ├── docker/               shared docker assets
│   ├── postgres/init/        creates one database per service (auth/user/product/inventory/sales/supplier/reporting/notification)
│   ├── redis/                redis.conf
│   ├── rabbitmq/             reserved (event-driven services)
│   └── monitoring/           prometheus.yml (reserved)
│
├── docs/                     architecture / api / database / diagrams
├── scripts/                  build-all.bat · start-dev.bat · stop-dev.bat · migrate.bat
├── .env  ·  .gitignore  ·  docker-compose.yml  ·  pom.xml
└── README.md
```

See **[docs/architecture/OVERVIEW.md](docs/architecture/OVERVIEW.md)** for the
full module map, dependency rules and conventions, and
**[docs/architecture/SERVICE_TEMPLATE.md](docs/architecture/SERVICE_TEMPLATE.md)**
to add a new service.

## 2. Architecture in one picture

```
   Client ──Bearer JWT──▶ api-gateway ──X-User-* headers──▶ auth-service ──Feign /internal──▶ user-service
                              │                                  │                                  │
                          validate JWT                        auth_db                            user_db
                       (security-lib JwtTokenProvider)
   all services register with discovery-server (Eureka)
```

- **DB-per-service**, **stateless JWT**, gateway-centric validation, identity
  forwarded as trusted headers, service-to-service over OpenFeign + a shared
  internal API key. No shared tables; no entities in `shared/`.

## 3. Ports

| Component        | Port |   | Component            | Port |
|------------------|------|---|----------------------|------|
| api-gateway      | 8080 |   | reporting-service    | 8086 |
| auth-service     | 8081 |   | supplier-service     | 8087 |
| user-service     | 8082 |   | notification-service | 8088 |
| product-service  | 8083 |   | discovery            | 8761 |
| inventory-service| 8084 |   | postgres             | 5432 |
| sales-service    | 8085 |   | redis                | 6379 |
| frontend (Vite)  | 5173 |   |                      |      |

## 4. Run

### Docker (recommended)

```bat
scripts\start-dev.bat      :: docker compose up --build -d
scripts\stop-dev.bat       :: stop (add --wipe to drop volumes)
```
Or directly: `docker compose up --build`.

Then: Eureka `http://localhost:8761`, Gateway `http://localhost:8080`,
Swagger `http://localhost:8080/swagger-ui.html`.

### Local (no Docker)

```bat
scripts\build-all.bat
```
The postgres init script creates one database per service. Start
`discovery-server` first, then `api-gateway`, then the business services in any
order (e.g. `mvn -pl :discovery-server spring-boot:run`). Each service runs Flyway
on boot to create and seed its own schema.

### Frontend — `Supermarket_UI/` (React 19 + Vite)

POS admin dashboard. Talks to the backend **only through the gateway** (`/api`).

```bat
cd Supermarket_UI
npm install
npm run dev          :: http://localhost:5173
```

Config: `Supermarket_UI/.env` → `VITE_API_URL=http://localhost:8080/api`.
Login uses the seeded **username** accounts below (not email). The wiring lives in
`src/services/api.js` (fetch + Bearer token) and `src/context/AuthContext.jsx`
(real `POST /api/auth/login` then `GET /api/users/me`).

> Full stack up = backend running (Docker or local) **and** `npm run dev`.

### Seeded accounts (dev only)

| Username | Password   | Role       |
|----------|------------|------------|
| `ceo`    | `password` | ROLE_CEO   |
| `admin`  | `password` | ROLE_ADMIN |

### Team workflow (GitHub)

- `main` is protected/stable. Mỗi người làm nhánh riêng:
  `git checkout -b feat/<ten>-<viec>` → commit → `git push -u origin <branch>` → mở Pull Request.
- Mỗi service nghiệp vụ mới (product/inventory/sales/...) là một module Maven trong `services/`
  + một route ở `api-gateway` + (nếu cần) một client trong `src/services/api.js`.
  Xem `docs/architecture/SERVICE_TEMPLATE.md`.

## 5. Smoke test

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

curl -s http://localhost:8080/api/users/me -H "Authorization: Bearer <accessToken>"
```

## 6. Configuration

Key env vars (see `.env`): `JWT_SECRET` (must match in gateway + auth, ≥32 bytes),
`JWT_ACCESS_MINUTES`, `JWT_REFRESH_DAYS`, `INTERNAL_API_KEY`,
`POSTGRES_USER/PASSWORD`, `EUREKA_SERVER_URL`, `CORS_ALLOWED_ORIGINS`.

## 7. Docs

- [Architecture](docs/architecture/OVERVIEW.md) · [Service template](docs/architecture/SERVICE_TEMPLATE.md)
- [API reference](docs/api/README.md)
- [Database](docs/database/README.md)
- [Diagrams](docs/diagrams/README.md)
