# Database

DB-per-service on a single **MySQL 8** instance. Each service owns its schema and
its Flyway scripts under `services/<svc>/src/main/resources/db/migration`. Logical
databases are created by `infrastructure/mysql/init/init-databases.sql`.

Type conventions (MySQL 8): UUID PKs are `VARCHAR(36)` (bound via
`@JdbcTypeCode(SqlTypes.VARCHAR)`); timestamps are `DATETIME(6)` defaulting to
`CURRENT_TIMESTAMP(6)`; booleans are `TINYINT(1)`. MySQL has no partial indexes,
so soft-deletable codes use a plain unique index (codes are not reusable after a
soft delete).

## `auth_db` — owned by auth-service

### `refresh_tokens`
| Column      | Type        | Notes                          |
|-------------|-------------|--------------------------------|
| id          | VARCHAR(36) PK |                             |
| user_id     | VARCHAR(36)    | indexed                     |
| username    | VARCHAR(50) |                                |
| token_hash  | VARCHAR(64) | UNIQUE — SHA-256 of raw token  |
| expires_at  | DATETIME(6) | indexed                        |
| revoked     | TINYINT(1)  | default 0                      |
| created_at  | DATETIME(6) | default CURRENT_TIMESTAMP(6)   |

## `user_db` — owned by user-service

### `users`
| Column     | Type         | Notes                                   |
|------------|--------------|-----------------------------------------|
| id         | VARCHAR(36) PK |                                       |
| username   | VARCHAR(50)  | unique                                  |
| email      | VARCHAR(150) | unique                                  |
| password   | VARCHAR(255) | BCrypt hash                             |
| full_name  | VARCHAR(150) |                                         |
| phone      | VARCHAR(20)  | nullable                                |
| role       | VARCHAR(40)  | CHECK in ROLE_* enum                    |
| status     | VARCHAR(20)  | CHECK in (ACTIVE, INACTIVE, SUSPENDED)  |
| created_at | DATETIME(6)  | default CURRENT_TIMESTAMP(6)            |
| updated_at | DATETIME(6)  | default CURRENT_TIMESTAMP(6)            |
| deleted    | TINYINT(1)   | soft-delete flag                        |

Indexes: unique on `username`/`email`; plus `role` and `deleted` indexes.

Seed (`V2`): `ceo` / `admin`, password `password` — **dev only**.
