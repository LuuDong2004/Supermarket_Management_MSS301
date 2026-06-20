CREATE TABLE products (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    barcode    VARCHAR(40),
    name       VARCHAR(200)  NOT NULL,
    category   VARCHAR(80)   NOT NULL,
    price      NUMERIC(14,2) NOT NULL,
    cost       NUMERIC(14,2) NOT NULL,
    stock      INTEGER       NOT NULL DEFAULT 0,
    unit       VARCHAR(20),
    expiry     DATE,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_products_code ON products (code) WHERE deleted = FALSE;
CREATE INDEX idx_products_category ON products (category);

CREATE TABLE promotions (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    name       VARCHAR(150) NOT NULL,
    scope      VARCHAR(120) NOT NULL,
    discount   INTEGER      NOT NULL,
    type       VARCHAR(20)  NOT NULL,
    from_date  DATE         NOT NULL,
    to_date    DATE         NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_promotions_code ON promotions (code) WHERE deleted = FALSE;

CREATE TABLE vouchers (
    id         UUID          PRIMARY KEY,
    code       VARCHAR(40)   NOT NULL,
    type       VARCHAR(20)   NOT NULL,
    value      NUMERIC(14,2) NOT NULL,
    min_spend  NUMERIC(14,2) NOT NULL,
    label      VARCHAR(150)  NOT NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted    BOOLEAN       NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_vouchers_code ON vouchers (code) WHERE deleted = FALSE;
