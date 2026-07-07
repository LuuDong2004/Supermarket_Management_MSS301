CREATE TABLE employees (
    id          VARCHAR(36)   PRIMARY KEY,
    code        VARCHAR(50)   NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    role        VARCHAR(40),
    dept        VARCHAR(100),
    joined      DATE,
    phone       VARCHAR(20),
    status      VARCHAR(30),
    salary      DECIMAL(14,2),
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted     TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Uniqueness only matters for live (non-deleted) rows so a code can be reused
-- after a soft delete.
CREATE UNIQUE INDEX uq_employees_code ON employees (code);

CREATE INDEX idx_employees_deleted ON employees (deleted);

CREATE TABLE attendance (
    id          VARCHAR(36)   PRIMARY KEY,
    code        VARCHAR(50)   NOT NULL,
    employee    VARCHAR(150)  NOT NULL,
    date        DATE,
    check_in    VARCHAR(20),
    check_out   VARCHAR(20),
    hours       INTEGER,
    status      VARCHAR(30),
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted     TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE UNIQUE INDEX uq_attendance_code ON attendance (code);

CREATE INDEX idx_attendance_date    ON attendance (date);
CREATE INDEX idx_attendance_deleted ON attendance (deleted);
