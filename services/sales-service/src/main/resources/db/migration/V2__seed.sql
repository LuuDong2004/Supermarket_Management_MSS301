-- Seed sales data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO sales (id, code, sale_time, cashier, items, total, payment) VALUES
    (gen_random_uuid(), 'INV-20260615-0098', '09:41', 'Nguyễn Văn A',  6,  648000, 'Tiền mặt'),
    (gen_random_uuid(), 'INV-20260615-0097', '09:36', 'Nguyễn Văn A',  2,   96000, 'Thẻ'),
    (gen_random_uuid(), 'INV-20260615-0096', '09:28', 'Nguyễn Văn A', 11, 1240000, 'Ví điện tử'),
    (gen_random_uuid(), 'INV-20260615-0095', '09:15', 'Nguyễn Văn A',  3,  210000, 'Tiền mặt');

INSERT INTO shifts (id, code, cashier, open_at, close_at, opening, sales, status) VALUES
    (gen_random_uuid(), 'SH-330', 'Nguyễn Văn A', '2026-06-15 07:55', NULL,                2000000, 6480000, 'Đang mở'),
    (gen_random_uuid(), 'SH-329', 'Lê Văn C',     '2026-06-14 14:00', '2026-06-14 22:05',  2000000, 9120000, 'Đã đóng'),
    (gen_random_uuid(), 'SH-328', 'Nguyễn Văn A', '2026-06-14 07:50', '2026-06-14 14:00',  2000000, 7640000, 'Đã đóng');

INSERT INTO customers (id, code, name, phone, tier, points, joined, spent) VALUES
    (gen_random_uuid(), 'C001', 'Trần Thị Mai',    '0901234567', 'Gold',     1240, '2024-03-11', 12400000),
    (gen_random_uuid(), 'C002', 'Nguyễn Văn Hùng', '0912345678', 'Silver',    430, '2025-01-20',  4300000),
    (gen_random_uuid(), 'C003', 'Lê Hoàng Anh',    '0987654321', 'Member',     85, '2026-02-02',   850000),
    (gen_random_uuid(), 'C004', 'Phạm Thu Hà',     '0934567890', 'Platinum',  5210, '2023-08-15', 52100000);
