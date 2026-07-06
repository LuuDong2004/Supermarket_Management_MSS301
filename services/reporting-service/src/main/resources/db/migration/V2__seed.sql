-- Seed reporting datasets mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO sales_trend (id, label, revenue, orders, seq) VALUES
    (UUID(), 'T2', 42, 180, 1),
    (UUID(), 'T3', 38, 165, 2),
    (UUID(), 'T4', 51, 210, 3),
    (UUID(), 'T5', 47, 198, 4),
    (UUID(), 'T6', 63, 240, 5),
    (UUID(), 'T7', 78, 312, 6),
    (UUID(), 'CN', 69, 280, 7);

INSERT INTO category_share (id, name, value) VALUES
    (UUID(), 'Đồ uống',        32),
    (UUID(), 'Thực phẩm khô',  28),
    (UUID(), 'Gia vị',         16),
    (UUID(), 'Hóa phẩm',       14),
    (UUID(), 'Thực phẩm tươi', 10);

INSERT INTO employee_performance (id, name, sales, accuracy, hours, score) VALUES
    (UUID(), 'Nguyễn Văn A', 142, 99.20, 168, 92),
    (UUID(), 'Lê Văn C',     118, 98.10, 160, 86),
    (UUID(), 'Trần Thị B',     0, 99.80, 172, 90),
    (UUID(), 'Phạm Thị D',     0, 100.00, 176, 95);

INSERT INTO monthly_revenue (id, month, revenue, target, seq) VALUES
    (UUID(), 'T1',  980, 1000, 1),
    (UUID(), 'T2', 1120, 1050, 2),
    (UUID(), 'T3', 1040, 1100, 3),
    (UUID(), 'T4', 1260, 1150, 4),
    (UUID(), 'T5', 1340, 1250, 5),
    (UUID(), 'T6',  880, 1300, 6);

INSERT INTO service_status (id, name, port, status, uptime, cpu, mem) VALUES
    (UUID(), 'api-gateway',       8080, 'UP',   '12d 4h', 14, 38),
    (UUID(), 'auth-service',      8081, 'UP',   '12d 4h',  9, 31),
    (UUID(), 'user-service',      8082, 'UP',   '12d 4h',  7, 28),
    (UUID(), 'product-service',   8083, 'DOWN', '—',       0,  0),
    (UUID(), 'inventory-service', 8084, 'DOWN', '—',       0,  0),
    (UUID(), 'sales-service',     8085, 'DOWN', '—',       0,  0),
    (UUID(), 'reporting-service', 8086, 'DOWN', '—',       0,  0),
    (UUID(), 'discovery-server',  8761, 'UP',   '12d 4h',  5, 22);

INSERT INTO system_logs (id, code, time, level, service, message, actor) VALUES
    (UUID(), 'L9001', '2026-06-15 09:42:11', 'INFO',  'auth-service',      'User ceo logged in',                  'ceo'),
    (UUID(), 'L9000', '2026-06-15 09:40:03', 'WARN',  'inventory-service', 'Low stock: Dầu ăn Neptune (9)',       'system'),
    (UUID(), 'L8999', '2026-06-15 09:31:55', 'ERROR', 'sales-service',     'Payment gateway timeout, retried OK', 'cashier01'),
    (UUID(), 'L8998', '2026-06-15 09:15:22', 'INFO',  'user-service',      'Account created: cashier_le',         'admin'),
    (UUID(), 'L8997', '2026-06-15 08:58:40', 'INFO',  'api-gateway',       'Health check OK (8 services up)',     'system');
