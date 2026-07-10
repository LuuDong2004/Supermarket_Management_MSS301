-- Cashier / POS: sale line items, customer & loyalty on sales, returns/refunds,
-- and shift cash reconciliation (overage/shortage).

-- ----- Sale header: customer link, breakdown, loyalty, idempotency -----
ALTER TABLE sales
    ADD COLUMN customer_code   VARCHAR(30),
    ADD COLUMN customer_name   VARCHAR(150),
    ADD COLUMN subtotal        DECIMAL(14,2),
    ADD COLUMN discount        DECIMAL(14,2),
    ADD COLUMN vat             DECIMAL(14,2),
    ADD COLUMN amount_received DECIMAL(14,2),
    ADD COLUMN change_given    DECIMAL(14,2),
    ADD COLUMN points_earned   INTEGER,
    ADD COLUMN points_redeemed INTEGER,
    ADD COLUMN effects_applied TINYINT(1) NOT NULL DEFAULT 1;

-- ----- Sale line items -----
CREATE TABLE sale_items (
    id           VARCHAR(36)   PRIMARY KEY,
    sale_id      VARCHAR(36),
    product_code VARCHAR(40),
    product_name VARCHAR(200),
    unit_price   DECIMAL(14,2),
    quantity     INTEGER       NOT NULL DEFAULT 0,
    line_total   DECIMAL(14,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_sale_items_sale ON sale_items (sale_id);

-- ----- Returns / refunds -----
CREATE TABLE sale_returns (
    id            VARCHAR(36)   PRIMARY KEY,
    code          VARCHAR(40)   NOT NULL,
    sale_code     VARCHAR(40),
    cashier       VARCHAR(120),
    customer_code VARCHAR(30),
    return_date   VARCHAR(20),
    reason        VARCHAR(200),
    refund_amount DECIMAL(14,2),
    status        VARCHAR(20)   NOT NULL DEFAULT 'Đã hoàn',
    note          VARCHAR(300),
    created_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted       TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_sale_returns_code ON sale_returns (code);
CREATE INDEX idx_sale_returns_sale ON sale_returns (sale_code);

CREATE TABLE sale_return_items (
    id           VARCHAR(36)   PRIMARY KEY,
    return_id    VARCHAR(36),
    product_code VARCHAR(40),
    product_name VARCHAR(200),
    unit_price   DECIMAL(14,2),
    quantity     INTEGER       NOT NULL DEFAULT 0,
    line_total   DECIMAL(14,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_sale_return_items_return ON sale_return_items (return_id);

-- ----- Shift cash reconciliation -----
ALTER TABLE shifts
    ADD COLUMN closing_actual   DECIMAL(14,2),
    ADD COLUMN closing_expected DECIMAL(14,2),
    ADD COLUMN variance         DECIMAL(14,2),
    ADD COLUMN variance_note    VARCHAR(255),
    ADD COLUMN orders           INTEGER;
