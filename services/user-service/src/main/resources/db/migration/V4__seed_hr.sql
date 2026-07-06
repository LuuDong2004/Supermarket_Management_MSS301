-- Seed HR demo data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO employees (id, code, name, role, dept, joined, phone, status, salary, deleted)
VALUES
    (UUID(), 'E001', 'Nguyễn Văn A', 'ROLE_CASHIER',   'Thu ngân',  DATE '2024-05-01', '0901111222', 'Đang làm',  8500000.00,  0),
    (UUID(), 'E002', 'Trần Thị B',   'ROLE_WAREHOUSE', 'Kho',       DATE '2023-11-15', '0902222333', 'Đang làm',  9200000.00,  0),
    (UUID(), 'E003', 'Lê Văn C',     'ROLE_CASHIER',   'Thu ngân',  DATE '2025-02-10', '0903333444', 'Đang làm',  8000000.00,  0),
    (UUID(), 'E004', 'Phạm Thị D',   'ROLE_ADMIN',     'Quản trị',  DATE '2022-07-20', '0904444555', 'Đang làm',  14000000.00, 0);

INSERT INTO attendance (id, code, employee, date, check_in, check_out, hours, status, deleted)
VALUES
    (UUID(), 'AT1', 'Nguyễn Văn A', DATE '2026-06-15', '07:55', '16:05', 8, 'Đúng giờ', 0),
    (UUID(), 'AT2', 'Trần Thị B',   DATE '2026-06-15', '08:10', '17:00', 8, 'Đi muộn',  0),
    (UUID(), 'AT3', 'Lê Văn C',     DATE '2026-06-15', '—',     '—',     0, 'Vắng',     0),
    (UUID(), 'AT4', 'Phạm Thị D',   DATE '2026-06-15', '07:50', '17:10', 9, 'Đúng giờ', 0);
