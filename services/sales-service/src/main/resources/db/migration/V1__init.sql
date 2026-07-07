CREATE TABLE sales (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(40)   NOT NULL,
    sale_time  VARCHAR(20),
    cashier    VARCHAR(120),
    items      INTEGER       NOT NULL DEFAULT 0,
    total      DECIMAL(14,2) NOT NULL,
    payment    VARCHAR(30),
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_sales_code ON sales (code);

CREATE TABLE shifts (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    cashier    VARCHAR(120),
    open_at    VARCHAR(30),
    close_at   VARCHAR(30),
    opening    DECIMAL(14,2),
    sales      DECIMAL(14,2),
    status     VARCHAR(20),
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_shifts_code ON shifts (code);

CREATE TABLE customers (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    name       VARCHAR(150)  NOT NULL,
    phone      VARCHAR(20),
    tier       VARCHAR(20),
    points     INTEGER       NOT NULL DEFAULT 0,
    joined     DATE,
    spent      DECIMAL(14,2),
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_customers_code ON customers (code);
CREATE INDEX idx_customers_phone ON customers (phone);
