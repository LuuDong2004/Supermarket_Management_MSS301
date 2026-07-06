-- Seed inventory data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO inventory_items (id, code, product_code, name, category, on_hand, threshold, location, unit) VALUES
    ('11111111-1111-4111-8111-000000000001', 'INV-P001', 'P001', 'Sữa tươi Vinamilk 1L',        'Đồ uống',        120, 10, 'Kệ A', 'hộp'),
    ('11111111-1111-4111-8111-000000000002', 'INV-P002', 'P002', 'Gạo ST25 5kg',                'Thực phẩm khô',   64, 10, 'Kệ A', 'túi'),
    ('11111111-1111-4111-8111-000000000003', 'INV-P003', 'P003', 'Dầu ăn Neptune 1L',           'Gia vị',           9, 10, 'Kệ A', 'chai'),
    ('11111111-1111-4111-8111-000000000004', 'INV-P004', 'P004', 'Mì Hảo Hảo (thùng 30)',       'Thực phẩm khô',  210, 10, 'Kệ A', 'thùng'),
    ('11111111-1111-4111-8111-000000000005', 'INV-P005', 'P005', 'Nước ngọt Coca 1.5L',         'Đồ uống',          8, 10, 'Kệ A', 'chai'),
    ('11111111-1111-4111-8111-000000000006', 'INV-P006', 'P006', 'Trứng gà hộp 10',             'Thực phẩm tươi',  45, 10, 'Kệ A', 'hộp'),
    ('11111111-1111-4111-8111-000000000007', 'INV-P007', 'P007', 'Bột giặt Omo 3kg',            'Hóa phẩm',        38, 10, 'Kệ A', 'túi'),
    ('11111111-1111-4111-8111-000000000008', 'INV-P008', 'P008', 'Nước mắm Nam Ngư 500ml',      'Gia vị',           7, 10, 'Kệ A', 'chai'),
    ('11111111-1111-4111-8111-000000000009', 'INV-P009', 'P009', 'Cà phê G7 hộp 21',            'Đồ uống',         90, 10, 'Kệ A', 'hộp'),
    ('11111111-1111-4111-8111-000000000010', 'INV-P010', 'P010', 'Khăn giấy Pulppy',            'Hóa phẩm',       150, 10, 'Kệ A', 'lốc');

INSERT INTO warehouse_transactions (id, code, type, ref, product, qty, txn_date, status) VALUES
    ('22222222-2222-4222-8222-000000000001', 'WT-1042', 'Nhập kho',   'PO-2026-040', 'Mì Hảo Hảo',        50,  '2026-06-13', 'Chờ duyệt'),
    ('22222222-2222-4222-8222-000000000002', 'WT-1041', 'Xuất kho',   'SO-9921',     'Sữa Vinamilk',     -30,  '2026-06-13', 'Chờ duyệt'),
    ('22222222-2222-4222-8222-000000000003', 'WT-1040', 'Điều chỉnh', 'ADJ-220',     'Trứng gà',          -5,  '2026-06-12', 'Đã duyệt'),
    ('22222222-2222-4222-8222-000000000004', 'WT-1039', 'Nhập kho',   'PO-2026-039', 'Nước mắm Nam Ngư', 100,  '2026-06-11', 'Đã duyệt');

INSERT INTO stock_adjustments (id, code, product, system_qty, counted_qty, diff, reason, adj_date, status) VALUES
    ('33333333-3333-4333-8333-000000000001', 'ADJ-221', 'Dầu ăn Neptune',  12,  9, -3, 'Hư hỏng',    '2026-06-13', 'Chờ duyệt'),
    ('33333333-3333-4333-8333-000000000002', 'ADJ-220', 'Trứng gà hộp 10', 50, 45, -5, 'Vỡ',         '2026-06-12', 'Đã duyệt'),
    ('33333333-3333-4333-8333-000000000003', 'ADJ-219', 'Coca 1.5L',       10,  8, -2, 'Thất thoát', '2026-06-10', 'Từ chối');

INSERT INTO stock_counts (id, code, location, status, count_date, note) VALUES
    ('44444444-4444-4444-8444-000000000001', 'SC-001', 'Kệ A',     'Hoàn tất',  '2026-06-12', NULL),
    ('44444444-4444-4444-8444-000000000002', 'SC-002', 'Kho lạnh', 'Đang kiểm', '2026-06-15', NULL);
