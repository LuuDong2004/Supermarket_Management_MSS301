CREATE TABLE approval_requests (
    id         UUID         PRIMARY KEY,
    code       VARCHAR(30)  NOT NULL,
    type       VARCHAR(80)  NOT NULL,
    requester  VARCHAR(150) NOT NULL,
    target     VARCHAR(150) NOT NULL,
    req_date   DATE         NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    note       VARCHAR(512),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_approval_requests_code ON approval_requests (code) WHERE deleted = FALSE;

CREATE TABLE business_policies (
    id           UUID         PRIMARY KEY,
    code         VARCHAR(30)  NOT NULL,
    name         VARCHAR(150) NOT NULL,
    value        VARCHAR(150) NOT NULL,
    category     VARCHAR(80)  NOT NULL,
    updated_date DATE         NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted      BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_business_policies_code ON business_policies (code) WHERE deleted = FALSE;

CREATE TABLE notifications (
    id         UUID         PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    message    VARCHAR(512) NOT NULL,
    level      VARCHAR(20)  NOT NULL,
    recipient  VARCHAR(80)  NOT NULL,
    read_flag  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE system_settings (
    id            UUID         PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    label         VARCHAR(150) NOT NULL,
    category      VARCHAR(80)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted       BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE UNIQUE INDEX uq_system_settings_key ON system_settings (setting_key) WHERE deleted = FALSE;
