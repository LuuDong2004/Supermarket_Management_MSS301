CREATE TABLE sales (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(40)   NOT NULL,
    sale_time  VARCHAR(20),
    cashier    VARCHAR(120),
    items      INTEGER       NOT NULL DEFAULT 0,
    total      NUMERIC(14,2) NOT NULL,
    payment    VARCHAR(30),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_sales_code ON sales (code) WHERE deleted = FALSE;

CREATE TABLE shifts (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    cashier    VARCHAR(120),
    open_at    VARCHAR(30),
    close_at   VARCHAR(30),
    opening    NUMERIC(14,2),
    sales      NUMERIC(14,2),
    status     VARCHAR(20),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_shifts_code ON shifts (code) WHERE deleted = FALSE;

CREATE TABLE customers (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    name       VARCHAR(150)  NOT NULL,
    phone      VARCHAR(20),
    tier       VARCHAR(20),
    points     INTEGER       NOT NULL DEFAULT 0,
    joined     DATE,
    spent      NUMERIC(14,2),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_customers_code ON customers (code) WHERE deleted = FALSE;
CREATE INDEX idx_customers_phone ON customers (phone);
