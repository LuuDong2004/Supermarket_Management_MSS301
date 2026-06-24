-- Seed catalog data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO products (id, code, barcode, name, category, price, cost, stock, unit, expiry) VALUES
    (gen_random_uuid(), 'P001', '8930001', 'Sữa tươi Vinamilk 1L',        'Đồ uống',         32000,  26000, 120, 'hộp',   '2026-09-12'),
    (gen_random_uuid(), 'P002', '8930002', 'Gạo ST25 5kg',                'Thực phẩm khô',   165000, 140000, 64, 'túi',   '2027-01-20'),
    (gen_random_uuid(), 'P003', '8930003', 'Dầu ăn Neptune 1L',           'Gia vị',          48000,  41000,  9, 'chai',  '2026-11-05'),
    (gen_random_uuid(), 'P004', '8930004', 'Mì Hảo Hảo (thùng 30)',       'Thực phẩm khô',   115000, 98000, 210, 'thùng', '2026-07-01'),
    (gen_random_uuid(), 'P005', '8930005', 'Nước ngọt Coca 1.5L',         'Đồ uống',         18000,  14000,  8, 'chai',  '2026-06-28'),
    (gen_random_uuid(), 'P006', '8930006', 'Trứng gà hộp 10',             'Thực phẩm tươi',  35000,  28000, 45, 'hộp',   '2026-06-22'),
    (gen_random_uuid(), 'P007', '8930007', 'Bột giặt Omo 3kg',            'Hóa phẩm',        92000,  78000, 38, 'túi',   '2028-03-01'),
    (gen_random_uuid(), 'P008', '8930008', 'Nước mắm Nam Ngư 500ml',      'Gia vị',          28000,  22000,  7, 'chai',  '2027-05-15'),
    (gen_random_uuid(), 'P009', '8930009', 'Cà phê G7 hộp 21',            'Đồ uống',         56000,  47000, 90, 'hộp',   '2026-12-10'),
    (gen_random_uuid(), 'P010', '8930010', 'Khăn giấy Pulppy',            'Hóa phẩm',        24000,  19000, 150, 'lốc',  '2029-01-01');

INSERT INTO promotions (id, code, name, scope, discount, type, from_date, to_date, status) VALUES
    (gen_random_uuid(), 'PR01', 'Tuần lễ đồ uống',       'Đồ uống',      15, 'percent', '2026-06-10', '2026-06-20', 'Đang chạy'),
    (gen_random_uuid(), 'PR02', 'Mua 2 tặng 1 mì gói',   'Mì Hảo Hảo',   33, 'percent', '2026-06-01', '2026-06-30', 'Đang chạy'),
    (gen_random_uuid(), 'PR03', 'Cuối tuần vàng',        'Toàn bộ',       5, 'percent', '2026-06-21', '2026-06-22', 'Lên lịch');

INSERT INTO vouchers (id, code, type, value, min_spend, label) VALUES
    (gen_random_uuid(), 'WELCOME10', 'percent', 10,    100000, 'Giảm 10% đơn từ 100k'),
    (gen_random_uuid(), 'SALE50K',   'amount',  50000, 500000, 'Giảm 50k đơn từ 500k'),
    (gen_random_uuid(), 'FREESHIP',  'amount',  20000, 200000, 'Giảm 20k phí giao');
