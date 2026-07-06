-- MySQL init: one logical database per service (product, inventory).
-- Runs automatically via /docker-entrypoint-initdb.d on first container start.
CREATE DATABASE IF NOT EXISTS product_db   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- The application user is created by MYSQL_USER/MYSQL_PASSWORD but only granted on
-- the primary DB; grant it access to every service DB explicitly.
CREATE USER IF NOT EXISTS 'supermarket'@'%' IDENTIFIED BY 'supermarket';
GRANT ALL PRIVILEGES ON product_db.*   TO 'supermarket'@'%';
GRANT ALL PRIVILEGES ON inventory_db.* TO 'supermarket'@'%';
FLUSH PRIVILEGES;
