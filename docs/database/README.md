# Database

DB-per-service. Each service owns its schema and its Flyway scripts under
`services/<svc>/src/main/resources/db/migration`. Logical databases are created
by `infrastructure/postgres/init/init-databases.sql`.

## `auth_db` — owned by auth-service

### `refresh_tokens`
| Column      | Type        | Notes                          |
|-------------|-------------|--------------------------------|
| id          | UUID PK     |                                |
| user_id     | UUID        | indexed                        |
| username    | VARCHAR(50) |                                |
| token_hash  | VARCHAR(64) | UNIQUE — SHA-256 of raw token  |
| expires_at  | TIMESTAMPTZ | indexed                        |
| revoked     | BOOLEAN     | default false                  |
| created_at  | TIMESTAMPTZ | default now()                  |

## `user_db` — owned by user-service

### `users`
| Column     | Type         | Notes                                   |
|------------|--------------|-----------------------------------------|
| id         | UUID PK      |                                         |
| username   | VARCHAR(50)  | unique among non-deleted rows           |
| email      | VARCHAR(150) | unique among non-deleted rows           |
| password   | VARCHAR(255) | BCrypt hash                             |
| full_name  | VARCHAR(150) |                                         |
| phone      | VARCHAR(20)  | nullable                                |
| role       | VARCHAR(40)  | CHECK in ROLE_* enum                    |
| status     | VARCHAR(20)  | CHECK in (ACTIVE, INACTIVE, SUSPENDED)  |
| created_at | TIMESTAMPTZ  | default now()                           |
| updated_at | TIMESTAMPTZ  | default now()                           |
| deleted    | BOOLEAN      | soft-delete flag                        |

Indexes: partial unique on `username`/`email` where `deleted = false`; plus
`role` and `deleted` indexes.

Seed (`V2`): `ceo` / `admin`, password `password` — **dev only**.
