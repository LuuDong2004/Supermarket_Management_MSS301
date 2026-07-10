-- Security alerts backing UC-A05 (Monitor Security Alerts).
CREATE TABLE security_alerts (
    id          VARCHAR(36)  PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL,
    type        VARCHAR(80)  NOT NULL,
    severity    VARCHAR(20)  NOT NULL,
    source      VARCHAR(80)  NOT NULL,
    actor       VARCHAR(80),
    ip_address  VARCHAR(45),
    detected_at VARCHAR(30)  NOT NULL,
    status      VARCHAR(20)  NOT NULL,
    note        VARCHAR(512),
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted     TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_security_alerts_code ON security_alerts (code);

INSERT INTO security_alerts (id, code, type, severity, source, actor, ip_address, detected_at, status, note) VALUES
    (UUID(), 'SA9005', 'Đăng nhập thất bại nhiều lần', 'Cao',        'auth-service', 'unknown',    '203.0.113.24', '2026-07-09 22:14:05', 'Mở',      '5 lần đăng nhập sai liên tiếp cho tài khoản admin.'),
    (UUID(), 'SA9004', 'Truy cập trái phép',           'Cao',        'api-gateway',  'cashier01',  '10.0.0.51',    '2026-07-09 18:02:41', 'Mở',      'Cố gọi endpoint /api/users bằng vai trò CASHIER.'),
    (UUID(), 'SA9003', 'Rủi ro phân quyền',            'Trung bình', 'user-service', 'admin',      '10.0.0.10',    '2026-07-08 09:30:12', 'Mở',      'Gán vai trò CEO cho tài khoản mới trong 24h.'),
    (UUID(), 'SA9002', 'Đăng nhập bất thường',         'Trung bình', 'auth-service', 'ceo',        '198.51.100.7', '2026-07-07 02:11:58', 'Đã xử lý', 'Đăng nhập ngoài giờ từ IP lạ, đã xác minh hợp lệ.'),
    (UUID(), 'SA9001', 'Token hết hạn bị tái sử dụng', 'Thấp',       'api-gateway',  'system',     '10.0.0.33',    '2026-07-06 14:45:20', 'Đã xử lý', 'Refresh token đã thu hồi bị dùng lại, đã chặn.');
