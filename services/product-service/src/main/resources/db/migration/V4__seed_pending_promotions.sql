-- Pending promotion campaigns awaiting CEO approval (UC-CEO05).
INSERT INTO promotions (id, code, name, scope, discount, type, from_date, to_date, status) VALUES
    ('22222222-2222-4222-8222-000000000004', 'PR04', 'Khai trương chi nhánh mới', 'Toàn bộ',     10, 'percent', '2026-07-01', '2026-07-07', 'Chờ duyệt'),
    ('22222222-2222-4222-8222-000000000005', 'PR05', 'Giảm giá hóa phẩm mùa hè',  'Hóa phẩm',    20, 'percent', '2026-07-10', '2026-07-20', 'Chờ duyệt'),
    ('22222222-2222-4222-8222-000000000006', 'PR06', 'Combo gia vị tiết kiệm',    'Gia vị',   30000, 'amount',  '2026-07-05', '2026-07-15', 'Chờ duyệt');
