-- MySQL init: one logical database per service (DB-per-service pattern on a
-- single MySQL instance). Runs automatically via /docker-entrypoint-initdb.d
-- on first container start.
CREATE DATABASE IF NOT EXISTS auth_db         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS user_db         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS product_db      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS inventory_db    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS sales_db        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS supplier_db     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS reporting_db    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- The application user is created by MYSQL_USER/MYSQL_PASSWORD but only granted on
-- the primary DB; grant it access to every service DB explicitly.
CREATE USER IF NOT EXISTS 'supermarket'@'%' IDENTIFIED BY 'supermarket';
GRANT ALL PRIVILEGES ON auth_db.*         TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON user_db.*         TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON product_db.*      TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON inventory_db.*    TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON sales_db.*        TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON supplier_db.*     TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON reporting_db.*    TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON notification_db.* TO 'supermarket'@'%';
FLUSH PRIVILEGES;
