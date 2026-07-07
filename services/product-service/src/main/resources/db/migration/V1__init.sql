CREATE TABLE products (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(30)   NOT NULL,
    barcode    VARCHAR(40),
    name       VARCHAR(200)  NOT NULL,
    category   VARCHAR(80)   NOT NULL,
    price      DECIMAL(14,2) NOT NULL,
    cost       DECIMAL(14,2) NOT NULL,
    stock      INTEGER       NOT NULL DEFAULT 0,
    unit       VARCHAR(20),
    expiry     DATE,
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_products_code ON products (code);
CREATE INDEX idx_products_category ON products (category);

CREATE TABLE promotions (
    id         VARCHAR(36)  PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    name       VARCHAR(150) NOT NULL,
    scope      VARCHAR(120) NOT NULL,
    discount   INTEGER      NOT NULL,
    type       VARCHAR(20)  NOT NULL,
    from_date  DATE         NOT NULL,
    to_date    DATE         NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_promotions_code ON promotions (code);

CREATE TABLE vouchers (
    id         VARCHAR(36)   PRIMARY KEY,
    code       VARCHAR(40)   NOT NULL,
    type       VARCHAR(20)   NOT NULL,
    value      DECIMAL(14,2) NOT NULL,
    min_spend  DECIMAL(14,2) NOT NULL,
    label      VARCHAR(150)  NOT NULL,
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_vouchers_code ON vouchers (code);
