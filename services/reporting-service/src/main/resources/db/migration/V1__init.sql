CREATE TABLE sales_trend (
    id         VARCHAR(36)  PRIMARY KEY,
    label      VARCHAR(10)  NOT NULL,
    revenue    INTEGER      NOT NULL,
    orders     INTEGER      NOT NULL,
    seq        INTEGER      NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE category_share (
    id         VARCHAR(36)  PRIMARY KEY,
    name       VARCHAR(80)  NOT NULL,
    value      INTEGER      NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employee_performance (
    id         VARCHAR(36)  PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    sales      INTEGER      NOT NULL,
    accuracy   DECIMAL(5,2) NOT NULL,
    hours      INTEGER      NOT NULL,
    score      INTEGER      NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE monthly_revenue (
    id         VARCHAR(36)  PRIMARY KEY,
    month      VARCHAR(10)  NOT NULL,
    revenue    INTEGER      NOT NULL,
    target     INTEGER      NOT NULL,
    seq        INTEGER      NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE service_status (
    id         VARCHAR(36)  PRIMARY KEY,
    name       VARCHAR(80)  NOT NULL,
    port       INTEGER      NOT NULL,
    status     VARCHAR(10)  NOT NULL,
    uptime     VARCHAR(20),
    cpu        INTEGER      NOT NULL,
    mem        INTEGER      NOT NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE system_logs (
    id         VARCHAR(36)  PRIMARY KEY,
    code       VARCHAR(20)  NOT NULL,
    time       VARCHAR(30)  NOT NULL,
    level      VARCHAR(10)  NOT NULL,
    service    VARCHAR(80)  NOT NULL,
    message    VARCHAR(512) NOT NULL,
    actor      VARCHAR(80),
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_system_logs_code ON system_logs (code);
