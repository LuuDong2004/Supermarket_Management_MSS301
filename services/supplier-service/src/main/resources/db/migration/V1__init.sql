CREATE TABLE suppliers (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    name       VARCHAR(150)  NOT NULL,
    contact    VARCHAR(100),
    phone      VARCHAR(30),
    rating     DECIMAL(3,1),
    status     VARCHAR(30),
    terms      VARCHAR(30),
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_suppliers_code ON suppliers (code);

CREATE TABLE purchase_orders (
    id         VARCHAR(36)    PRIMARY KEY,
    code       VARCHAR(30)    NOT NULL,
    supplier   VARCHAR(150)   NOT NULL,
    order_date DATE           NOT NULL,
    items      INTEGER        NOT NULL DEFAULT 0,
    total      DECIMAL(14,2)  NOT NULL,
    status     VARCHAR(30)    NOT NULL,
    approval   VARCHAR(30),
    created_at DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)     NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_purchase_orders_code ON purchase_orders (code);
CREATE INDEX idx_purchase_orders_order_date ON purchase_orders (order_date);
