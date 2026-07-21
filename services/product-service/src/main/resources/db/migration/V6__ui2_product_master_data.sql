-- Align the product/category master data contract with the management screens.
ALTER TABLE products
    ADD COLUMN supplier VARCHAR(150) NULL AFTER expiry,
    ADD COLUMN vat DECIMAL(5,2) NOT NULL DEFAULT 8.00 AFTER supplier,
    ADD COLUMN threshold INTEGER NOT NULL DEFAULT 10 AFTER vat,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' AFTER threshold;

ALTER TABLE categories
    ADD COLUMN requires_expiry TINYINT(1) NOT NULL DEFAULT 0 AFTER active,
    ADD COLUMN tax_group VARCHAR(20) NOT NULL DEFAULT 'VAT 8%' AFTER requires_expiry;

UPDATE products SET supplier = CASE
    WHEN code IN ('P001','P006') THEN 'Công ty Vinamilk'
    WHEN code IN ('P002','P008') THEN 'Masan Consumer'
    WHEN code = 'P004' THEN 'Acecook Việt Nam'
    ELSE 'Nhà phân phối trung tâm'
END;
UPDATE products SET threshold = CASE WHEN stock < 20 THEN 10 ELSE 20 END;
UPDATE categories SET requires_expiry = 1 WHERE name IN ('Đồ uống', 'Thực phẩm tươi');
UPDATE categories SET tax_group = 'VAT 5%' WHERE name = 'Thực phẩm tươi';

INSERT INTO products (id, code, barcode, name, category, price, cost, stock, unit, expiry, supplier, vat, threshold, status)
VALUES
 (UUID(), 'P011', '8930011', 'Sữa chua Vinamilk lốc 4', 'Đồ uống', 28000, 22000, 32, 'lốc', '2026-08-18', 'Công ty Vinamilk', 8, 12, 'ACTIVE'),
 (UUID(), 'P012', '8930012', 'Nước suối Lavie 500ml', 'Đồ uống', 7000, 5000, 180, 'chai', '2027-05-30', 'Nhà phân phối trung tâm', 8, 30, 'ACTIVE'),
 (UUID(), 'P013', '8930013', 'Đường Biên Hòa 1kg', 'Gia vị', 26000, 21500, 56, 'túi', '2027-03-12', 'Masan Consumer', 8, 15, 'ACTIVE'),
 (UUID(), 'P014', '8930014', 'Nước rửa chén Sunlight 750g', 'Hóa phẩm', 35000, 28500, 41, 'chai', '2028-12-31', 'Nhà phân phối trung tâm', 10, 12, 'ACTIVE'),
 (UUID(), 'P015', '8930015', 'Phô mai lát 200g', 'Thực phẩm tươi', 62000, 51000, 6, 'gói', '2026-08-05', 'Công ty Vinamilk', 5, 10, 'ACTIVE');
