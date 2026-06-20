CREATE TABLE suppliers (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    name       VARCHAR(150) NOT NULL,
    contact    VARCHAR(100),
    phone      VARCHAR(30),
    rating     NUMERIC(3,1),
    status     VARCHAR(30),
    terms      VARCHAR(30),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_suppliers_code ON suppliers (code) WHERE deleted = FALSE;

CREATE TABLE purchase_orders (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    supplier   VARCHAR(150)  NOT NULL,
    order_date DATE          NOT NULL,
    items      INTEGER       NOT NULL DEFAULT 0,
    total      NUMERIC(14,2) NOT NULL,
    status     VARCHAR(30)   NOT NULL,
    approval   VARCHAR(30),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_purchase_orders_code ON purchase_orders (code) WHERE deleted = FALSE;
CREATE INDEX idx_purchase_orders_order_date ON purchase_orders (order_date);
