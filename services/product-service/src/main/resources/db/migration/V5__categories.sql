-- Managed product categories (UC-M01).
CREATE TABLE categories (
    id          VARCHAR(36)  PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL,
    description VARCHAR(255),
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    seq         INTEGER      NOT NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted     TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_categories_name ON categories (name);

INSERT INTO categories (id, name, description, active, seq) VALUES
    (UUID(), 'Đồ uống',        'Nước giải khát, bia, nước suối',        1, 1),
    (UUID(), 'Thực phẩm khô',  'Mì gói, gạo, đồ hộp, gia vị đóng gói',  1, 2),
    (UUID(), 'Gia vị',         'Nước mắm, dầu ăn, muối, đường',         1, 3),
    (UUID(), 'Hóa phẩm',       'Bột giặt, nước rửa, vệ sinh',           1, 4),
    (UUID(), 'Thực phẩm tươi', 'Rau củ, thịt, cá, trái cây',           1, 5);
