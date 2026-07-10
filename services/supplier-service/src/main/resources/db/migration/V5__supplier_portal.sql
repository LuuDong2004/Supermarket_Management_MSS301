-- Supplier portal: link supplier to a login account, PO supplier-side workflow,
-- supplier profile fields, and a supplier price list / catalog.

-- ----- Supplier: login link + profile fields -----
ALTER TABLE suppliers
    ADD COLUMN email            VARCHAR(100),
    ADD COLUMN address          VARCHAR(255),
    ADD COLUMN account_username VARCHAR(50);

CREATE INDEX idx_suppliers_account ON suppliers (account_username);

-- Link the demo supplier login (username 'supplier') to Vinamilk (S001).
UPDATE suppliers
   SET account_username = 'supplier',
       email = 'contact@vinamilk.com.vn',
       address = '10 Tân Trào, Quận 7, TP.HCM'
 WHERE code = 'S001';

-- ----- Purchase order: supplier-side workflow -----
ALTER TABLE purchase_orders
    ADD COLUMN supplier_status   VARCHAR(30) NOT NULL DEFAULT 'Chờ xác nhận',
    ADD COLUMN expected_delivery DATE,
    ADD COLUMN delivered_date    DATE,
    ADD COLUMN supplier_note     VARCHAR(255);

-- A couple more POs for the demo supplier so the portal has content.
INSERT INTO purchase_orders (id, code, supplier, order_date, items, total, status, approval, supplier_status) VALUES
    (UUID(), 'PO-2026-045', 'Công ty Vinamilk', '2026-07-05', 10, 22000000, 'Approved', 'Đã duyệt', 'Chờ xác nhận'),
    (UUID(), 'PO-2026-046', 'Công ty Vinamilk', '2026-07-08',  5, 11500000, 'Approved', 'Đã duyệt', 'Đã xác nhận');

-- ----- Supplier price list / catalog -----
CREATE TABLE supplier_price_items (
    id           VARCHAR(36)   PRIMARY KEY,
    code         VARCHAR(40)   NOT NULL,
    supplier     VARCHAR(150)  NOT NULL,
    product_name VARCHAR(200)  NOT NULL,
    unit         VARCHAR(30),
    price        DECIMAL(14,2),
    moq          INTEGER,
    status       VARCHAR(20)   NOT NULL DEFAULT 'Đang bán',
    note         VARCHAR(255),
    created_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted      TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE UNIQUE INDEX uq_price_items_code ON supplier_price_items (code);
CREATE INDEX idx_price_items_supplier ON supplier_price_items (supplier);

INSERT INTO supplier_price_items (id, code, supplier, product_name, unit, price, moq, status) VALUES
    (UUID(), 'PL-0001', 'Công ty Vinamilk', 'Sữa tươi Vinamilk 100% 1L', 'thùng', 320000, 10, 'Đang bán'),
    (UUID(), 'PL-0002', 'Công ty Vinamilk', 'Sữa chua Vinamilk lốc 4',   'lốc',    24000, 50, 'Đang bán');
