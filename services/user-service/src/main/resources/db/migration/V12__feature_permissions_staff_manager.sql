-- Add the Staff Manager column to the permission matrix and re-align every row
-- with the enforced @PreAuthorize model:
--   admin  = system administration only (no sales / warehouse / HR),
--   HR     = Staff Manager,
--   business features scoped to their operating roles.

ALTER TABLE feature_permissions
    ADD COLUMN staff_manager TINYINT(1) NOT NULL DEFAULT 0 AFTER warehouse_staff;

-- Sales / POS
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=0, cashier=1 WHERE feature_code='F01'; -- Bán hàng / POS
UPDATE feature_permissions SET ceo=1, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=0, cashier=1 WHERE feature_code='F02'; -- Khuyến mãi & Voucher (CEO quản lý, thu ngân áp dụng)
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=0, cashier=1 WHERE feature_code='F03'; -- Khách hàng thành viên

-- Warehouse
UPDATE feature_permissions SET ceo=1, admin=0, warehouse_manager=1, warehouse_staff=0, staff_manager=0, cashier=0 WHERE feature_code='F04'; -- Quản lý sản phẩm
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=1, warehouse_staff=1, staff_manager=0, cashier=0 WHERE feature_code='F05'; -- Tồn kho & Nhận hàng
UPDATE feature_permissions SET ceo=1, admin=0, warehouse_manager=1, warehouse_staff=0, staff_manager=0, cashier=0 WHERE feature_code='F06'; -- Đơn mua hàng
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=1, warehouse_staff=1, staff_manager=0, cashier=0 WHERE feature_code='F07'; -- Điều chỉnh tồn kho

-- HR — owned by Staff Manager
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=1, cashier=0 WHERE feature_code='F08'; -- Hồ sơ nhân viên
UPDATE feature_permissions SET ceo=0, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=1, cashier=0 WHERE feature_code='F09'; -- Chấm công

-- CEO operations
UPDATE feature_permissions SET ceo=1, admin=0, warehouse_manager=0, warehouse_staff=0, staff_manager=0, cashier=0 WHERE feature_code IN ('F10','F11','F12');

-- System administration — Admin only
UPDATE feature_permissions SET ceo=0, admin=1, warehouse_manager=0, warehouse_staff=0, staff_manager=0, cashier=0 WHERE feature_code IN ('F13','F14','F15');
