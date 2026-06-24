# product-service

Owns the **product catalog**: products, promotion campaigns and discount
vouchers. Backs the POS promotion screens (3.9.3) and provides product/category
lookups consumed across the platform.

- Port: `8083` · Database: `product_db`
- Java root: `com.mss301.product`
- Gateway routes: `/api/products/**`, `/api/promotions/**`, `/api/vouchers/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/products` | any | search (`query`, `category`) + pagination |
| GET    | `/api/products/categories` | any | distinct categories |
| GET    | `/api/products/low-stock?threshold=` | any | low-stock list |
| GET    | `/api/products/{id}` | any | by id |
| POST   | `/api/products` | ADMIN, CEO, WAREHOUSE_MANAGER | create |
| PUT    | `/api/products/{id}` | ADMIN, CEO, WAREHOUSE_MANAGER | update |
| DELETE | `/api/products/{id}` | ADMIN, CEO | soft delete |
| GET/POST/PUT/DELETE | `/api/promotions/**` | ADMIN, CEO (writes) | campaigns |
| GET/POST/DELETE | `/api/vouchers/**` | ADMIN, CEO (writes) | vouchers |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
