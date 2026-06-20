-- Seed data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO approval_requests (id, code, type, requester, target, req_date, status, note) VALUES
    (gen_random_uuid(), 'AR-501', 'Tạo tài khoản',  'Phạm Thị D (Admin)',         'User: cashier_le',              '2026-06-14', 'Chờ duyệt', 'Thêm thu ngân ca tối'),
    (gen_random_uuid(), 'AR-500', 'Thay đổi quyền', 'Phạm Thị D (Admin)',         'User: tranb → Warehouse Mgr',   '2026-06-13', 'Chờ duyệt', 'Đề xuất thăng chức'),
    (gen_random_uuid(), 'AR-499', 'Điều chỉnh kho', 'Trần Thị B (Warehouse)',     'ADJ-221',                       '2026-06-13', 'Chờ duyệt', 'Dầu ăn hư hỏng 3 chai'),
    (gen_random_uuid(), 'AR-498', 'Chính sách giá', 'CEO Office',                 'PR03 Cuối tuần vàng',           '2026-06-12', 'Đã duyệt',  '');

INSERT INTO business_policies (id, code, name, value, category, updated_date) VALUES
    (gen_random_uuid(), 'BP01', 'Hạn mức giảm giá thu ngân',          '≤ 10%',           'Bán hàng',   '2026-05-30'),
    (gen_random_uuid(), 'BP02', 'Ngưỡng cảnh báo tồn kho thấp',       '10 đơn vị',       'Kho',        '2026-06-01'),
    (gen_random_uuid(), 'BP03', 'Cảnh báo cận hạn sử dụng',           '30 ngày',         'Kho',        '2026-06-01'),
    (gen_random_uuid(), 'BP04', 'Tỷ lệ tích điểm thành viên',         '1đ / 10.000đ',    'Thành viên', '2026-04-15'),
    (gen_random_uuid(), 'BP05', 'Hạn mức duyệt PO của Quản lý kho',   '≤ 20.000.000đ',   'Mua hàng',   '2026-05-20');

INSERT INTO notifications (id, title, message, level, recipient, read_flag) VALUES
    (gen_random_uuid(), 'Chào mừng',         'Chào mừng đến với hệ thống MSS301',                  'INFO', 'all',   FALSE),
    (gen_random_uuid(), 'Cảnh báo tồn thấp', 'Dầu ăn Neptune 1L sắp hết hàng (còn 9)',            'WARN', 'all',   FALSE),
    (gen_random_uuid(), 'Tài khoản mới',     'Tài khoản cashier_le vừa được tạo',                 'INFO', 'admin', FALSE);

INSERT INTO system_settings (id, setting_key, setting_value, label, category) VALUES
    (gen_random_uuid(), 'store.name',          'Siêu thị MSS301', 'Tên cửa hàng',      'Chung'),
    (gen_random_uuid(), 'currency',            'VND',             'Đơn vị tiền tệ',    'Chung'),
    (gen_random_uuid(), 'tax.rate',            '10',              'Thuế VAT (%)',      'Tài chính'),
    (gen_random_uuid(), 'low.stock.threshold', '10',              'Ngưỡng tồn thấp',   'Kho'),
    (gen_random_uuid(), 'points.rate',         '10000',           'VNĐ cho 1 điểm',    'Thành viên');
