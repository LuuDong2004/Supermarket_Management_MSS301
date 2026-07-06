CREATE TABLE suppliers (
    id         VARCHAR(36)   PRIMARY KEY,
    code       NVARCHAR(30)  NOT NULL,
    name       NVARCHAR(150) NOT NULL,
    contact    NVARCHAR(100),
    phone      NVARCHAR(30),
    rating     DECIMAL(3,1),
    status     NVARCHAR(30),
    terms      NVARCHAR(30),
    created_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    deleted    BIT           NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_suppliers_code ON suppliers (code) WHERE deleted = 0;

CREATE TABLE purchase_orders (
    id         VARCHAR(36)    PRIMARY KEY,
    code       NVARCHAR(30)   NOT NULL,
    supplier   NVARCHAR(150)  NOT NULL,
    order_date DATE           NOT NULL,
    items      INTEGER        NOT NULL DEFAULT 0,
    total      DECIMAL(14,2)  NOT NULL,
    status     NVARCHAR(30)   NOT NULL,
    approval   NVARCHAR(30),
    created_at DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    deleted    BIT            NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_purchase_orders_code ON purchase_orders (code) WHERE deleted = 0;
CREATE INDEX idx_purchase_orders_order_date ON purchase_orders (order_date);
