ALTER TABLE sale_return_items
    ADD COLUMN restockable TINYINT(1) NOT NULL DEFAULT 1;
