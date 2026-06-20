CREATE TABLE sales_trend (
    id         UUID         PRIMARY KEY,
    label      VARCHAR(10)  NOT NULL,
    revenue    INTEGER      NOT NULL,
    orders     INTEGER      NOT NULL,
    seq        INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE category_share (
    id         UUID         PRIMARY KEY,
    name       VARCHAR(80)  NOT NULL,
    value      INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE employee_performance (
    id         UUID         PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    sales      INTEGER      NOT NULL,
    accuracy   NUMERIC(5,2) NOT NULL,
    hours      INTEGER      NOT NULL,
    score      INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE monthly_revenue (
    id         UUID         PRIMARY KEY,
    month      VARCHAR(10)  NOT NULL,
    revenue    INTEGER      NOT NULL,
    target     INTEGER      NOT NULL,
    seq        INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE service_status (
    id         UUID         PRIMARY KEY,
    name       VARCHAR(80)  NOT NULL,
    port       INTEGER      NOT NULL,
    status     VARCHAR(10)  NOT NULL,
    uptime     VARCHAR(20),
    cpu        INTEGER      NOT NULL,
    mem        INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE system_logs (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(20)  NOT NULL,
    time       VARCHAR(30)  NOT NULL,
    level      VARCHAR(10)  NOT NULL,
    service    VARCHAR(80)  NOT NULL,
    message    VARCHAR(512) NOT NULL,
    actor      VARCHAR(80),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_system_logs_code ON system_logs (code) WHERE deleted = FALSE;
