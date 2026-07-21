UPDATE employees SET status = 'ACTIVE' WHERE deleted = 0;
UPDATE attendance SET status = CASE
    WHEN hours = 0 THEN 'ABSENT'
    WHEN check_in > '08:00' THEN 'LATE'
    ELSE 'PRESENT'
END WHERE deleted = 0;
UPDATE staff_shifts SET status = 'SCHEDULED' WHERE deleted = 0;

INSERT INTO employees (id, code, name, role, dept, joined, phone, status, salary, deleted) VALUES
    (UUID(), 'E005', 'Tran Minh Khoa', 'ROLE_WAREHOUSE_STAFF', 'Warehouse', '2024-08-12', '0905555005', 'ACTIVE', 9300000, 0),
    (UUID(), 'E006', 'Nguyen Thu Trang', 'ROLE_CASHIER', 'Cashier', '2025-03-06', '0905555006', 'ACTIVE', 8600000, 0),
    (UUID(), 'E007', 'Le Hoang Nam', 'ROLE_WAREHOUSE_STAFF', 'Warehouse', '2023-10-18', '0905555007', 'ACTIVE', 9800000, 0),
    (UUID(), 'E008', 'Pham Gia Linh', 'ROLE_CASHIER', 'Cashier', '2026-01-09', '0905555008', 'ACTIVE', 8200000, 0),
    (UUID(), 'E009', 'Vo Bao Long', 'ROLE_STAFF_MANAGER', 'Human Resources', '2022-04-15', '0905555009', 'ACTIVE', 15500000, 0),
    (UUID(), 'E010', 'Do Thanh Ha', 'ROLE_WAREHOUSE_STAFF', 'Inventory Control', '2025-11-22', '0905555010', 'ON_LEAVE', 10100000, 0);

INSERT INTO attendance (id, code, employee, date, check_in, check_out, hours, status, deleted) VALUES
    (UUID(), 'AT-260721-01', 'Nguyen Van A', '2026-07-21', '07:52', '16:04', 8, 'PRESENT', 0),
    (UUID(), 'AT-260721-02', 'Tran Thi B', '2026-07-21', '08:11', '17:02', 8, 'LATE', 0),
    (UUID(), 'AT-260721-03', 'Le Van C', '2026-07-21', '07:58', '16:01', 8, 'PRESENT', 0),
    (UUID(), 'AT-260721-04', 'Pham Thi D', '2026-07-21', '07:47', '17:10', 9, 'PRESENT', 0),
    (UUID(), 'AT-260721-05', 'Tran Minh Khoa', '2026-07-21', '07:55', '16:00', 8, 'PRESENT', 0),
    (UUID(), 'AT-260721-06', 'Nguyen Thu Trang', '2026-07-21', NULL, NULL, 0, 'ABSENT', 0),
    (UUID(), 'AT-260721-07', 'Le Hoang Nam', '2026-07-21', '08:06', '17:00', 8, 'LATE', 0),
    (UUID(), 'AT-260721-08', 'Pham Gia Linh', '2026-07-21', '07:49', '16:02', 8, 'PRESENT', 0);

INSERT INTO staff_shifts (id, code, employee_code, employee_name, shift_date, shift_type, start_time, end_time, area, note, status) VALUES
    (UUID(), 'SHF-0721-01', 'E001', 'Nguyen Van A', '2026-07-21', 'MORNING', '06:00', '14:00', 'Checkout 1', NULL, 'ACTIVE'),
    (UUID(), 'SHF-0721-02', 'E002', 'Tran Thi B', '2026-07-21', 'MORNING', '06:00', '14:00', 'Receiving', NULL, 'ACTIVE'),
    (UUID(), 'SHF-0721-03', 'E006', 'Nguyen Thu Trang', '2026-07-21', 'AFTERNOON', '14:00', '22:00', 'Checkout 2', 'Cover replacement required', 'SCHEDULED'),
    (UUID(), 'SHF-0721-04', 'E007', 'Le Hoang Nam', '2026-07-21', 'AFTERNOON', '14:00', '22:00', 'Warehouse A', NULL, 'SCHEDULED');
