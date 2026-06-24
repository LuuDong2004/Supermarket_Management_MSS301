# inventory-service

Owns the **inventory & warehouse** domain: stock-on-hand inventory items,
warehouse transactions (receipts/issues/adjustments), stock adjustments and
stock counts. Backs the warehouse management screens (sections 3.5.x).

- Port: `8084` · Database: `inventory_db`
- Java root: `com.mss301.inventory`
- Gateway routes: `/api/inventory/**`, `/api/warehouse-transactions/**`, `/api/stock-adjustments/**`, `/api/stock-counts/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/inventory` | any | search (`query`, `category`) + pagination |
| GET    | `/api/inventory/low-stock?threshold=` | any | items at/below threshold |
| GET    | `/api/inventory/{id}` | any | by id |
| POST   | `/api/inventory` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | create |
| PUT    | `/api/inventory/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | update |
| DELETE | `/api/inventory/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | soft delete |
| GET    | `/api/warehouse-transactions` | any | list, newest first (`txnDate` desc) |
| GET    | `/api/warehouse-transactions/{id}` | any | by id |
| POST   | `/api/warehouse-transactions` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | create |
| PUT    | `/api/warehouse-transactions/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | update |
| POST   | `/api/warehouse-transactions/{id}/approve` | ADMIN, WAREHOUSE_MANAGER | set status `Đã duyệt` |
| POST   | `/api/warehouse-transactions/{id}/reject` | ADMIN, WAREHOUSE_MANAGER | set status `Từ chối` |
| DELETE | `/api/warehouse-transactions/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | soft delete |
| GET    | `/api/stock-adjustments` | any | list, newest first (`adjDate` desc) |
| GET    | `/api/stock-adjustments/{id}` | any | by id |
| POST   | `/api/stock-adjustments` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | create |
| PUT    | `/api/stock-adjustments/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | update |
| POST   | `/api/stock-adjustments/{id}/approve` | ADMIN, WAREHOUSE_MANAGER | set status `Đã duyệt` |
| POST   | `/api/stock-adjustments/{id}/reject` | ADMIN, WAREHOUSE_MANAGER | set status `Từ chối` |
| DELETE | `/api/stock-adjustments/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | soft delete |
| GET    | `/api/stock-counts` | any | list, newest first (`countDate` desc) |
| GET    | `/api/stock-counts/{id}` | any | by id |
| POST   | `/api/stock-counts` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | create |
| PUT    | `/api/stock-counts/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | update |
| DELETE | `/api/stock-counts/{id}` | ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF | soft delete |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
