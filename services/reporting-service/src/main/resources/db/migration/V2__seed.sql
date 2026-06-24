-- Seed reporting datasets mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO sales_trend (id, label, revenue, orders, seq) VALUES
    (gen_random_uuid(), 'T2', 42, 180, 1),
    (gen_random_uuid(), 'T3', 38, 165, 2),
    (gen_random_uuid(), 'T4', 51, 210, 3),
    (gen_random_uuid(), 'T5', 47, 198, 4),
    (gen_random_uuid(), 'T6', 63, 240, 5),
    (gen_random_uuid(), 'T7', 78, 312, 6),
    (gen_random_uuid(), 'CN', 69, 280, 7);

INSERT INTO category_share (id, name, value) VALUES
    (gen_random_uuid(), 'Đồ uống',        32),
    (gen_random_uuid(), 'Thực phẩm khô',  28),
    (gen_random_uuid(), 'Gia vị',         16),
    (gen_random_uuid(), 'Hóa phẩm',       14),
    (gen_random_uuid(), 'Thực phẩm tươi', 10);

INSERT INTO employee_performance (id, name, sales, accuracy, hours, score) VALUES
    (gen_random_uuid(), 'Nguyễn Văn A', 142, 99.20, 168, 92),
    (gen_random_uuid(), 'Lê Văn C',     118, 98.10, 160, 86),
    (gen_random_uuid(), 'Trần Thị B',     0, 99.80, 172, 90),
    (gen_random_uuid(), 'Phạm Thị D',     0, 100.00, 176, 95);

INSERT INTO monthly_revenue (id, month, revenue, target, seq) VALUES
    (gen_random_uuid(), 'T1',  980, 1000, 1),
    (gen_random_uuid(), 'T2', 1120, 1050, 2),
    (gen_random_uuid(), 'T3', 1040, 1100, 3),
    (gen_random_uuid(), 'T4', 1260, 1150, 4),
    (gen_random_uuid(), 'T5', 1340, 1250, 5),
    (gen_random_uuid(), 'T6',  880, 1300, 6);

INSERT INTO service_status (id, name, port, status, uptime, cpu, mem) VALUES
    (gen_random_uuid(), 'api-gateway',       8080, 'UP',   '12d 4h', 14, 38),
    (gen_random_uuid(), 'auth-service',      8081, 'UP',   '12d 4h',  9, 31),
    (gen_random_uuid(), 'user-service',      8082, 'UP',   '12d 4h',  7, 28),
    (gen_random_uuid(), 'product-service',   8083, 'DOWN', '—',       0,  0),
    (gen_random_uuid(), 'inventory-service', 8084, 'DOWN', '—',       0,  0),
    (gen_random_uuid(), 'sales-service',     8085, 'DOWN', '—',       0,  0),
    (gen_random_uuid(), 'reporting-service', 8086, 'DOWN', '—',       0,  0),
    (gen_random_uuid(), 'discovery-server',  8761, 'UP',   '12d 4h',  5, 22);

INSERT INTO system_logs (id, code, time, level, service, message, actor) VALUES
    (gen_random_uuid(), 'L9001', '2026-06-15 09:42:11', 'INFO',  'auth-service',      'User ceo logged in',                  'ceo'),
    (gen_random_uuid(), 'L9000', '2026-06-15 09:40:03', 'WARN',  'inventory-service', 'Low stock: Dầu ăn Neptune (9)',       'system'),
    (gen_random_uuid(), 'L8999', '2026-06-15 09:31:55', 'ERROR', 'sales-service',     'Payment gateway timeout, retried OK', 'cashier01'),
    (gen_random_uuid(), 'L8998', '2026-06-15 09:15:22', 'INFO',  'user-service',      'Account created: cashier_le',         'admin'),
    (gen_random_uuid(), 'L8997', '2026-06-15 08:58:40', 'INFO',  'api-gateway',       'Health check OK (8 services up)',     'system');
