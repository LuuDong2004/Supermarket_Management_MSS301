// configs/constants.js - App constants

export const APP_NAME = 'GotPOS';
export const APP_VERSION = '1.0.0';

// Tài khoản seed sẵn trong backend (dev only) — đăng nhập bằng USERNAME.
// Xem README mục "Seeded accounts": ceo/password, admin/password.
export const DEMO_CREDENTIALS = {
  ceo: { username: 'ceo', password: 'password', role: 'ROLE_CEO' },
  admin: { username: 'admin', password: 'password', role: 'ROLE_ADMIN' },
};

// Theme settings
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const SIDEBAR_SIZES = {
  LARGE: 'large',
  SMALL: 'small',
  COLLAPSED: 'collapsed',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
