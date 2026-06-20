CREATE TABLE inventory_items (
    id           UUID         PRIMARY KEY,
    code         VARCHAR(30)  NOT NULL,
    product_code VARCHAR(30)  NOT NULL,
    name         VARCHAR(200) NOT NULL,
    category     VARCHAR(80)  NOT NULL,
    on_hand      INTEGER      NOT NULL DEFAULT 0,
    threshold    INTEGER      NOT NULL DEFAULT 0,
    location     VARCHAR(80),
    unit         VARCHAR(20),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted      BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_inventory_items_code ON inventory_items (code) WHERE deleted = FALSE;
CREATE INDEX idx_inventory_items_category ON inventory_items (category);

CREATE TABLE warehouse_transactions (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    type       VARCHAR(30)  NOT NULL,
    ref        VARCHAR(40),
    product    VARCHAR(200) NOT NULL,
    qty        INTEGER      NOT NULL,
    txn_date   DATE         NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_warehouse_transactions_code ON warehouse_transactions (code) WHERE deleted = FALSE;

CREATE TABLE stock_adjustments (
    id          UUID         PRIMARY KEY,
    code        VARCHAR(30)  NOT NULL,
    product     VARCHAR(200) NOT NULL,
    system_qty  INTEGER      NOT NULL,
    counted_qty INTEGER      NOT NULL,
    diff        INTEGER      NOT NULL,
    reason      VARCHAR(150),
    adj_date    DATE         NOT NULL,
    status      VARCHAR(30)  NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted     BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_stock_adjustments_code ON stock_adjustments (code) WHERE deleted = FALSE;

CREATE TABLE stock_counts (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    location   VARCHAR(80)  NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    count_date DATE         NOT NULL,
    note       VARCHAR(250),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_stock_counts_code ON stock_counts (code) WHERE deleted = FALSE;
