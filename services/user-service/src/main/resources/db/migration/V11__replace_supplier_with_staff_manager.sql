-- Retire the ROLE_SUPPLIER *user* role and introduce ROLE_STAFF_MANAGER, the
-- owner of HR/personnel management. Supplier *vendor* records (supplier-service)
-- are a separate domain and are untouched; only the login role is removed.

-- 1. Widen the users CHECK constraint to the new role set.
ALTER TABLE users DROP CHECK chk_users_role;
ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN (
    'ROLE_CEO', 'ROLE_ADMIN', 'ROLE_WAREHOUSE_MANAGER',
    'ROLE_WAREHOUSE_STAFF', 'ROLE_STAFF_MANAGER', 'ROLE_CASHIER'));

-- 2. Migrate any existing supplier-role logins.
UPDATE users
   SET role = 'ROLE_STAFF_MANAGER', updated_at = CURRENT_TIMESTAMP(6)
 WHERE role = 'ROLE_SUPPLIER';

-- 3. Re-home the demo 'supplier' account as the Staff Manager demo login.
UPDATE users
   SET username = 'staffmanager',
       email = 'staffmanager@mss301.local',
       full_name = 'Lê Văn Cường',
       role = 'ROLE_STAFF_MANAGER',
       updated_at = CURRENT_TIMESTAMP(6)
 WHERE username = 'supplier';

-- 4. Fix the phantom ROLE_WAREHOUSE label seeded into the employees table (V4).
UPDATE employees
   SET role = 'ROLE_WAREHOUSE_STAFF', updated_at = CURRENT_TIMESTAMP(6)
 WHERE role = 'ROLE_WAREHOUSE';
