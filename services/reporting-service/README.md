# reporting-service

Owns **reporting, analytics and monitoring**: sales trends, category share,
employee performance, monthly revenue, a dashboard summary, service health
status and system logs. Backs the CEO/Admin analytics and monitoring screens
(sections 3.10–3.11). This is a mostly read-only service over seeded datasets.

- Port: `8086` · Database: `reporting_db`
- Java root: `com.mss301.reporting`
- Gateway routes: `/api/reports/**`, `/api/monitoring/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/reports/sales-trend` | CEO, ADMIN | weekly trend, ordered |
| GET    | `/api/reports/category-share` | CEO, ADMIN | revenue share by category |
| GET    | `/api/reports/employee-performance` | CEO, ADMIN | staff metrics |
| GET    | `/api/reports/monthly-revenue` | CEO, ADMIN | revenue vs target, ordered |
| GET    | `/api/reports/dashboard` | CEO, ADMIN | summary KPIs |
| GET    | `/api/monitoring/services` | ADMIN | service health list |
| GET    | `/api/monitoring/logs` | ADMIN | system logs, newest first |
| POST   | `/api/monitoring/logs` | ADMIN | append a system log |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
