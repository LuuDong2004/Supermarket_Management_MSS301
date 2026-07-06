-- SQL Server init: one logical database per service (sales, supplier).
-- SQL Server has no docker-entrypoint-initdb.d, so this is executed by the
-- one-shot `sqlserver-init` container via sqlcmd once the server is healthy.
IF DB_ID('sales_db')    IS NULL CREATE DATABASE sales_db;
IF DB_ID('supplier_db') IS NULL CREATE DATABASE supplier_db;
GO
