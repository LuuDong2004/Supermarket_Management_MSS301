-- Seed inventory data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO inventory_items (id, code, product_code, name, category, on_hand, threshold, location, unit) VALUES
    (gen_random_uuid(), 'INV-P001', 'P001', 'Sữa tươi Vinamilk 1L',        'Đồ uống',        120, 10, 'Kệ A', 'hộp'),
    (gen_random_uuid(), 'INV-P002', 'P002', 'Gạo ST25 5kg',                'Thực phẩm khô',   64, 10, 'Kệ A', 'túi'),
    (gen_random_uuid(), 'INV-P003', 'P003', 'Dầu ăn Neptune 1L',           'Gia vị',           9, 10, 'Kệ A', 'chai'),
    (gen_random_uuid(), 'INV-P004', 'P004', 'Mì Hảo Hảo (thùng 30)',       'Thực phẩm khô',  210, 10, 'Kệ A', 'thùng'),
    (gen_random_uuid(), 'INV-P005', 'P005', 'Nước ngọt Coca 1.5L',         'Đồ uống',          8, 10, 'Kệ A', 'chai'),
    (gen_random_uuid(), 'INV-P006', 'P006', 'Trứng gà hộp 10',             'Thực phẩm tươi',  45, 10, 'Kệ A', 'hộp'),
    (gen_random_uuid(), 'INV-P007', 'P007', 'Bột giặt Omo 3kg',            'Hóa phẩm',        38, 10, 'Kệ A', 'túi'),
    (gen_random_uuid(), 'INV-P008', 'P008', 'Nước mắm Nam Ngư 500ml',      'Gia vị',           7, 10, 'Kệ A', 'chai'),
    (gen_random_uuid(), 'INV-P009', 'P009', 'Cà phê G7 hộp 21',            'Đồ uống',         90, 10, 'Kệ A', 'hộp'),
    (gen_random_uuid(), 'INV-P010', 'P010', 'Khăn giấy Pulppy',            'Hóa phẩm',       150, 10, 'Kệ A', 'lốc');

INSERT INTO warehouse_transactions (id, code, type, ref, product, qty, txn_date, status) VALUES
    (gen_random_uuid(), 'WT-1042', 'Nhập kho',   'PO-2026-040', 'Mì Hảo Hảo',        50,  '2026-06-13', 'Chờ duyệt'),
    (gen_random_uuid(), 'WT-1041', 'Xuất kho',   'SO-9921',     'Sữa Vinamilk',     -30,  '2026-06-13', 'Chờ duyệt'),
    (gen_random_uuid(), 'WT-1040', 'Điều chỉnh', 'ADJ-220',     'Trứng gà',          -5,  '2026-06-12', 'Đã duyệt'),
    (gen_random_uuid(), 'WT-1039', 'Nhập kho',   'PO-2026-039', 'Nước mắm Nam Ngư', 100,  '2026-06-11', 'Đã duyệt');

INSERT INTO stock_adjustments (id, code, product, system_qty, counted_qty, diff, reason, adj_date, status) VALUES
    (gen_random_uuid(), 'ADJ-221', 'Dầu ăn Neptune',  12,  9, -3, 'Hư hỏng',    '2026-06-13', 'Chờ duyệt'),
    (gen_random_uuid(), 'ADJ-220', 'Trứng gà hộp 10', 50, 45, -5, 'Vỡ',         '2026-06-12', 'Đã duyệt'),
    (gen_random_uuid(), 'ADJ-219', 'Coca 1.5L',       10,  8, -2, 'Thất thoát', '2026-06-10', 'Từ chối');

INSERT INTO stock_counts (id, code, location, status, count_date, note) VALUES
    (gen_random_uuid(), 'SC-001', 'Kệ A',     'Hoàn tất',  '2026-06-12', NULL),
    (gen_random_uuid(), 'SC-002', 'Kho lạnh', 'Đang kiểm', '2026-06-15', NULL);
