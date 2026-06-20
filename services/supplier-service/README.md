# supplier-service

Owns the **supplier directory** and **purchase orders**: vendor master data and
the inbound procurement workflow (create, approve, reject, receive). Backs the
purchasing screens and provides supplier lookups consumed across the platform.

- Port: `8087` · Database: `supplier_db`
- Java root: `com.mss301.supplier`
- Gateway routes: `/api/suppliers/**`, `/api/purchase-orders/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/suppliers` | any | search (`query` on name/contact) + pagination |
| GET    | `/api/suppliers/{id}` | any | by id |
| POST   | `/api/suppliers` | ADMIN, CEO | create |
| PUT    | `/api/suppliers/{id}` | ADMIN, CEO | update |
| DELETE | `/api/suppliers/{id}` | ADMIN, CEO | soft delete |
| GET    | `/api/purchase-orders` | any | list (newest first by order date) |
| GET    | `/api/purchase-orders/{id}` | any | by id |
| POST   | `/api/purchase-orders` | ADMIN, CEO, WAREHOUSE_MANAGER | create |
| PUT    | `/api/purchase-orders/{id}` | ADMIN, CEO, WAREHOUSE_MANAGER | update |
| POST   | `/api/purchase-orders/{id}/approve` | ADMIN, CEO, WAREHOUSE_MANAGER | status `Approved` |
| POST   | `/api/purchase-orders/{id}/reject` | ADMIN, CEO, WAREHOUSE_MANAGER | status `Rejected` |
| POST   | `/api/purchase-orders/{id}/receive` | ADMIN, CEO, WAREHOUSE_MANAGER | status `Received` |
| DELETE | `/api/purchase-orders/{id}` | ADMIN, CEO | soft delete |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
