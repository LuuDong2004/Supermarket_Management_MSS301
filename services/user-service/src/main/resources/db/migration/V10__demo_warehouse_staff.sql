-- Demo warehouse-staff account so every role has a quick-login on the login screen.
-- Password: 123456 (same BCrypt hash as the other demo accounts).

INSERT IGNORE INTO users (id, username, email, password, full_name, phone, role, status, deleted) VALUES
    (UUID(), 'staff', 'staff@mss301.local', '$2a$10$ex9uSuQkrCvlguqt9SFrK.oHCM.tekNzcv9KitbiUqjXParEKGqIy', 'Phạm Văn Dũng', NULL, 'ROLE_WAREHOUSE_STAFF', 'ACTIVE', 0);
