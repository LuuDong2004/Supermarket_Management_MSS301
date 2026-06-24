# notification-service

Owns **notifications, approval requests, business policies and system settings**.
Backs the admin/CEO operations screens (approvals, policy and settings management)
and the platform-wide notification feed.

- Port: `8088` · Database: `notification_db`
- Java root: `com.mss301.notification`
- Gateway routes: `/api/approval-requests/**`, `/api/policies/**`, `/api/notifications/**`, `/api/settings/**`

## Endpoints

| Method | Path | Roles | Notes |
|--------|------|-------|-------|
| GET    | `/api/approval-requests` | any | list, newest first by `reqDate` |
| GET    | `/api/approval-requests/{id}` | any | by id |
| POST   | `/api/approval-requests` | any | create |
| PUT    | `/api/approval-requests/{id}` | any | update |
| DELETE | `/api/approval-requests/{id}` | any | soft delete |
| POST   | `/api/approval-requests/{id}/approve` | ADMIN, CEO | status → `Đã duyệt` |
| POST   | `/api/approval-requests/{id}/reject` | ADMIN, CEO | status → `Từ chối` |
| GET    | `/api/policies` | any | list |
| GET    | `/api/policies/{id}` | any | by id |
| POST/PUT/DELETE | `/api/policies/**` | CEO, ADMIN | writes |
| GET    | `/api/notifications` | any | list, newest first by `createdAt` |
| GET    | `/api/notifications/unread-count` | any | unread count (`Long`) |
| POST   | `/api/notifications` | any | create |
| PATCH  | `/api/notifications/{id}/read` | any | mark read |
| DELETE | `/api/notifications/{id}` | any | soft delete |
| GET    | `/api/settings` | any | list |
| GET    | `/api/settings/{key}` | any | by setting key |
| POST   | `/api/settings` | ADMIN, CEO | create |
| PUT    | `/api/settings/{key}` | ADMIN, CEO | update value |

Data is seeded from `Supermarket_UI/src/mock/db.js` via Flyway
(`db/migration/V2__seed.sql`). This service owns its own schema; it never shares
JPA entities through `shared/`.
