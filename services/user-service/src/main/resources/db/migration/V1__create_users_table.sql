CREATE TABLE users (
    id          UUID         PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(150) NOT NULL,
    phone       VARCHAR(20),
    role        VARCHAR(40)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted     BOOLEAN      NOT NULL DEFAULT FALSE,

    CONSTRAINT chk_users_role CHECK (role IN (
        'ROLE_CEO', 'ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER',
        'ROLE_WAREHOUSE_STAFF', 'ROLE_SUPPLIER', 'ROLE_CASHIER')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- Uniqueness only matters for live (non-deleted) rows so a username/email can be
-- reused after a soft delete.
CREATE UNIQUE INDEX uq_users_username ON users (username) WHERE deleted = FALSE;
CREATE UNIQUE INDEX uq_users_email    ON users (email)    WHERE deleted = FALSE;

CREATE INDEX idx_users_role    ON users (role);
CREATE INDEX idx_users_deleted ON users (deleted);
