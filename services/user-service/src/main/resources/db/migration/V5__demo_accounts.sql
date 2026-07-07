-- Align the bootstrap/demo accounts with the frontend quick-login section.
-- Every demo account uses the password: 123456  (BCrypt hash below, strength 10).
-- Idempotent: safe to re-run (UPDATE + INSERT IGNORE on the unique username/email).

UPDATE users
   SET password = '$2a$10$ex9uSuQkrCvlguqt9SFrK.oHCM.tekNzcv9KitbiUqjXParEKGqIy',
       updated_at = CURRENT_TIMESTAMP(6)
 WHERE username IN ('ceo', 'admin');

INSERT IGNORE INTO users (id, username, email, password, full_name, phone, role, status, deleted) VALUES
    (UUID(), 'cashier',   'cashier@mss301.local',   '$2a$10$ex9uSuQkrCvlguqt9SFrK.oHCM.tekNzcv9KitbiUqjXParEKGqIy', 'Nguyễn Văn An', NULL, 'ROLE_CASHIER',           'ACTIVE', 0),
    (UUID(), 'warehouse', 'warehouse@mss301.local', '$2a$10$ex9uSuQkrCvlguqt9SFrK.oHCM.tekNzcv9KitbiUqjXParEKGqIy', 'Trần Thị Bình', NULL, 'ROLE_WAREHOUSE_MANAGER', 'ACTIVE', 0),
    (UUID(), 'supplier',  'supplier@mss301.local',  '$2a$10$ex9uSuQkrCvlguqt9SFrK.oHCM.tekNzcv9KitbiUqjXParEKGqIy', 'Lê Văn Cường',  NULL, 'ROLE_SUPPLIER',          'ACTIVE', 0);
