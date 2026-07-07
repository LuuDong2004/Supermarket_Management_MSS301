CREATE TABLE approval_requests (
    id         VARCHAR(36)  PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    type       VARCHAR(80)  NOT NULL,
    requester  VARCHAR(150) NOT NULL,
    target     VARCHAR(150) NOT NULL,
    req_date   DATE         NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    note       VARCHAR(512),
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_approval_requests_code ON approval_requests (code);

CREATE TABLE business_policies (
    id           VARCHAR(36)  PRIMARY KEY,
    code         VARCHAR(30)  NOT NULL,
    name         VARCHAR(150) NOT NULL,
    value        VARCHAR(150) NOT NULL,
    category     VARCHAR(80)  NOT NULL,
    updated_date DATE         NOT NULL,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted      TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_business_policies_code ON business_policies (code);

CREATE TABLE notifications (
    id         VARCHAR(36)  PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    message    VARCHAR(512) NOT NULL,
    level      VARCHAR(20)  NOT NULL,
    recipient  VARCHAR(80)  NOT NULL,
    read_flag  TINYINT(1)   NOT NULL DEFAULT 0,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted    TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE system_settings (
    id            VARCHAR(36)  PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    label         VARCHAR(150) NOT NULL,
    category      VARCHAR(80)  NOT NULL,
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted       TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_system_settings_key ON system_settings (setting_key);
