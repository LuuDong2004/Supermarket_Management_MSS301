CREATE TABLE sales (
    id         VARCHAR(36)   PRIMARY KEY,
    code       NVARCHAR(40)  NOT NULL,
    sale_time  NVARCHAR(20),
    cashier    NVARCHAR(120),
    items      INTEGER       NOT NULL DEFAULT 0,
    total      DECIMAL(14,2) NOT NULL,
    payment    NVARCHAR(30),
    created_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    deleted    BIT           NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_sales_code ON sales (code) WHERE deleted = 0;

CREATE TABLE shifts (
    id         VARCHAR(36)   PRIMARY KEY,
    code       NVARCHAR(30)  NOT NULL,
    cashier    NVARCHAR(120),
    open_at    NVARCHAR(30),
    close_at   NVARCHAR(30),
    opening    DECIMAL(14,2),
    sales      DECIMAL(14,2),
    status     NVARCHAR(20),
    created_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    deleted    BIT           NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_shifts_code ON shifts (code) WHERE deleted = 0;

CREATE TABLE customers (
    id         VARCHAR(36)   PRIMARY KEY,
    code       NVARCHAR(30)  NOT NULL,
    name       NVARCHAR(150) NOT NULL,
    phone      NVARCHAR(20),
    tier       NVARCHAR(20),
    points     INTEGER       NOT NULL DEFAULT 0,
    joined     DATE,
    spent      DECIMAL(14,2),
    created_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    deleted    BIT           NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_customers_code ON customers (code) WHERE deleted = 0;
CREATE INDEX idx_customers_phone ON customers (phone);
