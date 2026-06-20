# sales-service

Owns **sales, shifts and membership**: point-of-sale invoices, cashier shifts
and the loyalty customer base. Backs the POS / sales screens and provides
customer lookups for the checkout flow.

- Port: `8085` · Database: `sales_db`
- Java root: `com.mss301.sales`
- Gateway routes: `/api/sales/**`, `/api/shifts/**`, `/api/customers/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/sales` | any | list, newest first (by code desc) |
| GET    | `/api/sales/{id}` | any | by id |
| POST   | `/api/sales` | CASHIER, ADMIN | create |
| DELETE | `/api/sales/{id}` | ADMIN, CEO | soft delete |
| GET    | `/api/shifts` | any | list, newest first |
| GET    | `/api/shifts/{id}` | any | by id |
| POST   | `/api/shifts` | CASHIER, ADMIN | open shift |
| PUT    | `/api/shifts/{id}` | CASHIER, ADMIN | update / close shift |
| DELETE | `/api/shifts/{id}` | CASHIER, ADMIN | soft delete |
| GET    | `/api/customers` | any | search (`query`) + pagination |
| GET    | `/api/customers/{id}` | any | by id |
| GET    | `/api/customers/by-phone/{phone}` | any | by phone |
| POST   | `/api/customers` | CASHIER, ADMIN | create |
| PUT    | `/api/customers/{id}` | CASHIER, ADMIN | update |
| POST   | `/api/customers/{id}/points` | CASHIER, ADMIN | earn/redeem points (`{delta}`) |
| DELETE | `/api/customers/{id}` | CASHIER, ADMIN | soft delete |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
