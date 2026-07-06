CREATE TABLE users (
    id          VARCHAR(36)  PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(150) NOT NULL,
    phone       VARCHAR(20),
    role        VARCHAR(40)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted     TINYINT(1)   NOT NULL DEFAULT 0,

    CONSTRAINT chk_users_role CHECK (role IN (
        'ROLE_CEO', 'ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER',
        'ROLE_WAREHOUSE_STAFF', 'ROLE_SUPPLIER', 'ROLE_CASHIER')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Uniqueness only matters for live (non-deleted) rows so a username/email can be
-- reused after a soft delete.
CREATE UNIQUE INDEX uq_users_username ON users (username);
CREATE UNIQUE INDEX uq_users_email    ON users (email);

CREATE INDEX idx_users_role    ON users (role);
CREATE INDEX idx_users_deleted ON users (deleted);
