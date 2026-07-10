-- Role-based permission matrix (UC-A02). One row per feature; a boolean per role.
CREATE TABLE feature_permissions (
    id                VARCHAR(36)  PRIMARY KEY,
    feature_code      VARCHAR(20)  NOT NULL,
    feature_name      VARCHAR(120) NOT NULL,
    category          VARCHAR(40)  NOT NULL,
    ceo               TINYINT(1)   NOT NULL DEFAULT 0,
    admin             TINYINT(1)   NOT NULL DEFAULT 0,
    warehouse_manager TINYINT(1)   NOT NULL DEFAULT 0,
    warehouse_staff   TINYINT(1)   NOT NULL DEFAULT 0,
    cashier           TINYINT(1)   NOT NULL DEFAULT 0,
    seq               INTEGER      NOT NULL,
    created_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted           TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_feature_permissions_code ON feature_permissions (feature_code);

-- Seeded from the Screen Authorization matrix in the Requirement Spec.
INSERT INTO feature_permissions
    (id, feature_code, feature_name, category, ceo, admin, warehouse_manager, warehouse_staff, cashier, seq) VALUES
    (UUID(), 'F01', 'Bán hàng / POS',              'Bán hàng',  0, 1, 0, 0, 1, 1),
    (UUID(), 'F02', 'Khuyến mãi & Voucher',        'Bán hàng',  1, 1, 0, 0, 1, 2),
    (UUID(), 'F03', 'Khách hàng thành viên',       'Bán hàng',  0, 1, 0, 0, 1, 3),
    (UUID(), 'F04', 'Quản lý sản phẩm',            'Kho',       0, 1, 1, 0, 0, 4),
    (UUID(), 'F05', 'Tồn kho & Nhận hàng',         'Kho',       0, 1, 1, 1, 0, 5),
    (UUID(), 'F06', 'Đơn mua hàng',                'Kho',       0, 1, 1, 0, 0, 6),
    (UUID(), 'F07', 'Điều chỉnh tồn kho',          'Kho',       0, 1, 1, 0, 0, 7),
    (UUID(), 'F08', 'Hồ sơ nhân viên',             'Nhân sự',   1, 1, 0, 0, 0, 8),
    (UUID(), 'F09', 'Chấm công',                   'Nhân sự',   1, 1, 0, 0, 0, 9),
    (UUID(), 'F10', 'Báo cáo quản trị',            'Điều hành', 1, 1, 0, 0, 0, 10),
    (UUID(), 'F11', 'Duyệt khuyến mãi',            'Điều hành', 1, 0, 0, 0, 0, 11),
    (UUID(), 'F12', 'Quyết định chiến lược',       'Điều hành', 1, 0, 0, 0, 0, 12),
    (UUID(), 'F13', 'Quản lý người dùng',          'Hệ thống',  0, 1, 0, 0, 0, 13),
    (UUID(), 'F14', 'Cấu hình & Phân quyền',       'Hệ thống',  0, 1, 0, 0, 0, 14),
    (UUID(), 'F15', 'Giám sát & Cảnh báo bảo mật', 'Hệ thống',  0, 1, 0, 0, 0, 15);
