-- Seed bootstrap accounts so the platform is usable on first run.
-- BCrypt hash below corresponds to the password: "password"
-- !! Change these credentials immediately in any non-local environment. !!

INSERT INTO users (id, username, email, password, full_name, phone, role, status, deleted)
VALUES
    (UUID(), 'ceo',   'ceo@mss301.local',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Platform CEO',   NULL, 'ROLE_CEO',   'ACTIVE', 0),
    (UUID(), 'admin', 'admin@mss301.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin',   NULL, 'ROLE_ADMIN', 'ACTIVE', 0);
