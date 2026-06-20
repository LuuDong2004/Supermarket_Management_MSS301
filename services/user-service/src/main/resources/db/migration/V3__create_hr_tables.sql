CREATE TABLE employees (
    id          UUID          PRIMARY KEY,
    code        VARCHAR(50)   NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    role        VARCHAR(40),
    dept        VARCHAR(100),
    joined      DATE,
    phone       VARCHAR(20),
    status      VARCHAR(30),
    salary      NUMERIC(14,2),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted     BOOLEAN       NOT NULL DEFAULT FALSE
);

-- Uniqueness only matters for live (non-deleted) rows so a code can be reused
-- after a soft delete.
CREATE UNIQUE INDEX uq_employees_code ON employees (code) WHERE deleted = FALSE;

CREATE INDEX idx_employees_deleted ON employees (deleted);

CREATE TABLE attendance (
    id          UUID          PRIMARY KEY,
    code        VARCHAR(50)   NOT NULL,
    employee    VARCHAR(150)  NOT NULL,
    date        DATE,
    check_in    VARCHAR(20),
    check_out   VARCHAR(20),
    hours       INTEGER,
    status      VARCHAR(30),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    deleted     BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX uq_attendance_code ON attendance (code) WHERE deleted = FALSE;

CREATE INDEX idx_attendance_date    ON attendance (date);
CREATE INDEX idx_attendance_deleted ON attendance (deleted);
