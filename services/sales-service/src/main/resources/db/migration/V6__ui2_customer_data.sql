ALTER TABLE customers
    ADD COLUMN email VARCHAR(150),
    ADD COLUMN membership_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN last_purchase DATE;

UPDATE customers
SET email = CONCAT(LOWER(code), '@member.sms.local'),
    membership_status = 'ACTIVE',
    last_purchase = COALESCE(joined, CURRENT_DATE)
WHERE deleted = 0;

INSERT INTO customers
    (id, code, name, phone, email, tier, points, joined, spent, membership_status, last_purchase)
VALUES
    ('33333333-3333-4333-8333-000000000005', 'C005', 'Vo Minh Chau', '0905000005', 'chau.vo@example.com', 'SILVER', 320, '2025-07-12', 3200000, 'ACTIVE', '2026-07-18'),
    ('33333333-3333-4333-8333-000000000006', 'C006', 'Hoang Bao Ngoc', '0905000006', 'ngoc.hoang@example.com', 'GOLD', 1480, '2024-09-21', 14800000, 'ACTIVE', '2026-07-20'),
    ('33333333-3333-4333-8333-000000000007', 'C007', 'Do Gia Han', '0905000007', 'han.do@example.com', 'MEMBER', 95, '2026-03-04', 950000, 'ACTIVE', '2026-07-16'),
    ('33333333-3333-4333-8333-000000000008', 'C008', 'Bui Quoc Viet', '0905000008', 'viet.bui@example.com', 'SILVER', 610, '2025-02-15', 6100000, 'INACTIVE', '2026-04-09');

UPDATE sales
SET status = CASE
    WHEN UPPER(status) IN ('PENDING', 'COMPLETED', 'CANCELLED') THEN UPPER(status)
    WHEN status IS NULL OR status = '' THEN 'COMPLETED'
    ELSE 'COMPLETED'
END;

INSERT INTO sales
    (id, code, sale_time, cashier, items, total, payment, status, customer_code,
     customer_name, subtotal, discount, vat, points_earned, points_redeemed, effects_applied)
VALUES
    ('11111111-1111-4111-8111-000000000011', 'INV-20260721-0111', '08:12', 'Nguyen Van A', 3, 186000, 'CASH', 'COMPLETED', 'C005', 'Vo Minh Chau', 180000, 0, 6000, 18, 0, 1),
    ('11111111-1111-4111-8111-000000000012', 'INV-20260721-0112', '08:37', 'Nguyen Van A', 5, 428000, 'QR', 'COMPLETED', 'C006', 'Hoang Bao Ngoc', 420000, 10000, 18000, 42, 10, 1),
    ('11111111-1111-4111-8111-000000000013', 'INV-20260721-0113', '09:05', 'Nguyen Van A', 2, 96000, 'CASH', 'PENDING', 'C007', 'Do Gia Han', 92000, 0, 4000, 0, 0, 0),
    ('11111111-1111-4111-8111-000000000014', 'INV-20260721-0114', '09:24', 'Nguyen Van A', 7, 742000, 'QR', 'PENDING', NULL, NULL, 720000, 0, 22000, 0, 0, 0);

INSERT INTO sale_items (id, sale_id, product_code, product_name, unit_price, quantity, line_total)
VALUES
    ('51111111-1111-4111-8111-000000000011', '11111111-1111-4111-8111-000000000011', 'P001', 'Fresh Milk 1L', 32000, 2, 64000),
    ('51111111-1111-4111-8111-000000000012', '11111111-1111-4111-8111-000000000011', 'P005', 'Rice 5kg', 122000, 1, 122000),
    ('51111111-1111-4111-8111-000000000013', '11111111-1111-4111-8111-000000000012', 'P002', 'Greek Yogurt', 24000, 5, 120000),
    ('51111111-1111-4111-8111-000000000014', '11111111-1111-4111-8111-000000000012', 'P006', 'Cooking Oil 2L', 77000, 4, 308000),
    ('51111111-1111-4111-8111-000000000015', '11111111-1111-4111-8111-000000000013', 'P003', 'Butter 200g', 48000, 2, 96000),
    ('51111111-1111-4111-8111-000000000016', '11111111-1111-4111-8111-000000000014', 'P004', 'Cheese Slices', 106000, 7, 742000);
